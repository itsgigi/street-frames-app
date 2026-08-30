import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator, Share, Alert, Modal, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { EventHeader } from '@/components/features/EventHeader';
import { EventDescription } from '@/components/features/EventDescription';
import { EventMap } from '@/components/features/EventMap';
import { ParticipantsList } from '@/components/features/ParticipantsList';
import { WalkGallery } from '@/components/features/WalkGallery';
import { getEventById } from '@/services/mockData';
import { getWalkGallery, MAX_PHOTOS_PER_USER_PER_WALK, uploadWalkPhoto } from '@/services/photoService';
import { subscribeToWalkById, joinWalk, leaveWalk } from '@/services/walkService';
import { getUserProfiles } from '@/services/userService';
import { galleryQueryKeys } from '@/services/queryKeys';
import { useAuth } from '@/contexts/authContext';
import { Walk, UserProfile } from '@/types';
import { sf } from '@/constants/theme';

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Try mock data first — if found, it's a past event
  const mockEvent = getEventById(id ?? '');

  // Firestore walk state (only used when mockEvent is null)
  const [walk, setWalk] = useState<Walk | null | undefined>(mockEvent ? null : undefined);
  const [participants, setParticipants] = useState<UserProfile[]>([]);
  const [joining, setJoining] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewAssets, setPreviewAssets] = useState<ImagePicker.ImagePickerAsset[] | null>(null);
  const [previewWalkId, setPreviewWalkId] = useState<string | null>(null);

  // Track previous uid list to avoid redundant fetches
  const prevUidsRef = useRef<string>('');

  // Shares its cache with WalkGallery's query (same key + queryFn shape), so this adds no extra fetch.
  const { data: galleryPhotos } = useQuery({
    queryKey: galleryQueryKeys.walk(id ?? ''),
    queryFn: () => getWalkGallery(id ?? ''),
    enabled: !mockEvent && !!id,
  });

  const userPhotoCount = user
    ? (galleryPhotos ?? []).filter((p) => p.userId === user.uid).length
    : 0;
  const limitReached = userPhotoCount >= MAX_PHOTOS_PER_USER_PER_WALK;
  const remainingSlots = MAX_PHOTOS_PER_USER_PER_WALK - userPhotoCount;

  useEffect(() => {
    if (mockEvent || !id) return;

    const unsub = subscribeToWalkById(id, (w) => {
      setWalk(w);

      if (!w) return;
      const uidsKey = [...w.participantUids].sort().join(',');
      if (uidsKey === prevUidsRef.current) return;
      prevUidsRef.current = uidsKey;

      getUserProfiles(w.participantUids).then(setParticipants);
    });

    return unsub;
  }, [id]);

  const makeShareMessage = (title: string, date: string, location: string) => {
    const dateStr = new Date(date).toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric',
    });
    return `Join me at "${title}" on ${dateStr} in ${location}! 📷 #StreetFrames`;
  };

  const handleJoinLeave = async () => {
    if (!user || !walk) return;
    setJoining(true);
    try {
      const alreadyJoined = walk.participantUids.includes(user.uid);
      if (alreadyJoined) {
        await leaveWalk(walk.id, user.uid);
      } else {
        await joinWalk(walk.id, user.uid);
      }
    } finally {
      setJoining(false);
    }
  };

  const handlePickImages = async (walkId: string, canUpload: boolean, limitReached: boolean) => {

    if (!user) {
      Alert.alert('Sign in required', 'Please sign in to upload an image.');
      return;
    }

    if (!canUpload) {
      Alert.alert(
        'Upload unavailable',
        'You cannot upload photos for a photowalk you did not attend.'
      );
      return;
    }

    if (limitReached) {
      Alert.alert(
        'Upload limit reached',
        `You can only upload ${MAX_PHOTOS_PER_USER_PER_WALK} photos per walk. You have already reached the limit.`
      );
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow access to your photo library in Settings.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: false,
      allowsMultipleSelection: true,
      selectionLimit: remainingSlots,
      quality: 0.85,
    });

    if (result.canceled || result.assets.length === 0) return;

    // Defensive cap in case the OS doesn't honor selectionLimit.
    setPreviewAssets(result.assets.slice(0, remainingSlots));
    setPreviewWalkId(walkId);
  };

  const removePreviewAsset = (index: number) => {
    setPreviewAssets((prev) => prev?.filter((_, i) => i !== index) ?? null);
  };

  const handleCancelPreview = () => {
    setPreviewAssets(null);
    setPreviewWalkId(null);
  };

  const handleConfirmUpload = async () => {
    if (!user || !previewWalkId || !previewAssets || previewAssets.length === 0) return;

    const walkId = previewWalkId;
    const assets = previewAssets;

    setUploading(true);
    let successCount = 0;
    let failureMessage: string | null = null;

    for (const asset of assets) {
      try {
        await uploadWalkPhoto({
          localUri: asset.uri,
          userId: user.uid,
          walkId,
          tags: walk?.tags ?? [],
        });
        successCount += 1;
      } catch (err) {
        failureMessage = err instanceof Error
          ? err.message
          : 'Unable to upload right now. Please try again.';
        break;
      }
    }

    // Invalidate gallery caches so new photos appear immediately
    void queryClient.invalidateQueries({ queryKey: galleryQueryKeys.walk(walkId) });
    void queryClient.invalidateQueries({ queryKey: galleryQueryKeys.all });

    setUploading(false);
    setPreviewAssets(null);
    setPreviewWalkId(null);

    if (failureMessage) {
      Alert.alert(
        successCount > 0 ? 'Some photos failed' : 'Upload failed',
        successCount > 0
          ? `${successCount} of ${assets.length} photos uploaded. ${failureMessage}`
          : failureMessage
      );
    } else {
      Alert.alert('Uploaded', `${successCount} photo${successCount === 1 ? '' : 's'} uploaded successfully.`);
    }
  };

  // ── Mock event (past walks) ──────────────────────────────────────────────
  if (mockEvent) {
    const isUpcoming = new Date(mockEvent.date) > new Date();
    const joinedMockEvent = !!user;
    return (
      <View style={{ flex: 1, backgroundColor: sf.cream }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          <EventHeader
            title={mockEvent.title}
            date={mockEvent.date}
            location={mockEvent.location}
            coverImage={mockEvent.coverImage}
            onBack={() => router.back()}
            onShare={() => Share.share({
              message: makeShareMessage(mockEvent.title, mockEvent.date, mockEvent.location),
              title: mockEvent.title,
            })}
          />
          <View style={{ paddingHorizontal: 20, paddingTop: 24, gap: 16 }}>
            <View style={shadow}>
              <EventDescription description={mockEvent.description} />
            </View>
            <View style={shadow}>
              <WalkGallery walkId={mockEvent.id} />
            </View>
            <View style={shadow}>
              <ParticipantsList participants={[]} />
            </View>
          </View>
        </ScrollView>
        {isUpcoming && <JoinBar onPress={() => {}} joining={false} isPast={false} joined={false} insetBottom={insets.bottom} />}
        <UploadBar
          onPress={() => handlePickImages(mockEvent.id, joinedMockEvent, limitReached)}
          uploading={uploading}
          canUpload={joinedMockEvent}
          limitReached={limitReached}
          insetBottom={insets.bottom}
        />
        <UploadPreviewModal
          assets={previewAssets}
          uploading={uploading}
          onRemove={removePreviewAsset}
          onCancel={handleCancelPreview}
          onConfirm={handleConfirmUpload}
        />
      </View>
    );
  }

  // ── Loading Firestore walk ───────────────────────────────────────────────
  if (walk === undefined) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: sf.cream, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={sf.orange} />
      </SafeAreaView>
    );
  }

  // ── Walk not found ───────────────────────────────────────────────────────
  if (walk === null) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: sf.cream, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: sf.grayDark, fontSize: 16 }}>Walk not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: sf.orange, fontWeight: '600' }}>Go back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ── Live Firestore walk ──────────────────────────────────────────────────
  const isPast  = new Date(walk.date) <= new Date();
  const joined  = !!user && walk.participantUids.includes(user.uid);

  return (
    <View style={{ flex: 1, backgroundColor: sf.cream }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <EventHeader
          title={walk.title}
          date={walk.date}
          location={walk.location}
          coverImage={walk.coverImage}
          onBack={() => router.back()}
          onShare={() => Share.share({
            message: makeShareMessage(walk.title, walk.date, walk.location),
            title: walk.title,
          })}
        />
        <View style={{ paddingHorizontal: 20, paddingTop: 24, gap: 16 }}>
          <View style={shadow}>
            <EventDescription description={walk.description} />
          </View>
          <View style={shadow}>
            {isPast ? <WalkGallery walkId={walk.id} /> : <EventMap stops={walk.stops} />}
          </View>
          <View style={shadow}>
            <ParticipantsList participants={participants} />
          </View>
        </View>
      </ScrollView>

      {isPast ? (
        <UploadBar
          onPress={() => handlePickImages(walk.id, joined, limitReached)}
          uploading={uploading}
          canUpload={joined}
          limitReached={limitReached}
          insetBottom={insets.bottom}
        />
      ) : (
        <JoinBar
          onPress={handleJoinLeave}
          joining={joining}
          joined={joined}
          isPast={false}
          insetBottom={insets.bottom}
        />
      )}
      <UploadPreviewModal
        assets={previewAssets}
        uploading={uploading}
        onRemove={removePreviewAsset}
        onCancel={handleCancelPreview}
        onConfirm={handleConfirmUpload}
      />
    </View>
  );
}

function UploadBar({ onPress, uploading, canUpload, limitReached, insetBottom }: {
  onPress: () => void;
  uploading: boolean;
  canUpload: boolean;
  limitReached: boolean;
  insetBottom: number;
}) {
  const [showHint, setShowHint] = useState(false);
  const enabled = canUpload && !limitReached;

  useEffect(() => {
    if (!showHint) return;
    const timer = setTimeout(() => setShowHint(false), 2200);
    return () => clearTimeout(timer);
  }, [showHint]);

  const hintMessage = !canUpload
    ? 'You cannot upload photos for a photowalk you did not attend.'
    : `You've reached the ${MAX_PHOTOS_PER_USER_PER_WALK}-photo limit for this walk.`;

  return (
    <View style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      paddingHorizontal: 20,
      paddingBottom: insetBottom + 12,
      paddingTop: 12,
      backgroundColor: sf.cream,
      borderTopWidth: 1,
      borderTopColor: 'rgba(33,34,38,0.08)',
    }}>
      {showHint && !enabled && (
        <View style={{
          alignSelf: 'center',
          marginBottom: 10,
          paddingHorizontal: 12,
          paddingVertical: 8,
          backgroundColor: sf.grayDark,
          borderRadius: 10,
          maxWidth: '92%',
        }}>
          <Text style={{ color: sf.cream, fontSize: 12, fontWeight: '600', textAlign: 'center' }}>
            {hintMessage}
          </Text>
        </View>
      )}
      <TouchableOpacity
        onPress={() => {
          if (!enabled) {
            setShowHint(true);
            return;
          }
          onPress();
        }}
        disabled={uploading}
        activeOpacity={0.85}
        style={{
          backgroundColor: enabled ? sf.orange : sf.grayLight,
          borderRadius: 100,
          paddingVertical: 16,
          alignItems: 'center',
        }}
      >
        {uploading ? (
          <ActivityIndicator color={sf.cream} />
        ) : (
          <Text style={{
            fontSize: 15, fontWeight: '700',
            color: enabled ? sf.cream : sf.grayDark,
            letterSpacing: 0.3,
          }}>
            {limitReached && canUpload ? 'Upload limit reached' : 'Upload an image'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

function UploadPreviewModal({ assets, uploading, onRemove, onCancel, onConfirm }: {
  assets: ImagePicker.ImagePickerAsset[] | null;
  uploading: boolean;
  onRemove: (index: number) => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const visible = !!assets && assets.length > 0;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 }}>
        <View style={{ backgroundColor: sf.cream, borderRadius: 20, padding: 20, gap: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: sf.black }}>
            {assets?.length ?? 0} photo{(assets?.length ?? 0) === 1 ? '' : 's'} selected
          </Text>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {assets?.map((asset, index) => (
              <View
                key={asset.assetId ?? asset.uri}
                style={{
                  width: '31%',
                  aspectRatio: asset.width && asset.height ? asset.width / asset.height : 1,
                  borderRadius: 12,
                  overflow: 'hidden',
                  backgroundColor: sf.grayLight,
                }}
              >
                <Image source={{ uri: asset.uri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                <TouchableOpacity
                  onPress={() => onRemove(index)}
                  activeOpacity={0.8}
                  style={{
                    position: 'absolute', top: 4, right: 4,
                    width: 22, height: 22, borderRadius: 11,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Ionicons name="close" size={14} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              onPress={onCancel}
              disabled={uploading}
              activeOpacity={0.85}
              style={{
                flex: 1, paddingVertical: 14, borderRadius: 100, alignItems: 'center',
                borderWidth: 2, borderColor: sf.grayLight,
              }}
            >
              <Text style={{ fontWeight: '700', color: sf.grayDark }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              disabled={uploading || (assets?.length ?? 0) === 0}
              activeOpacity={0.85}
              style={{
                flex: 1, paddingVertical: 14, borderRadius: 100, alignItems: 'center',
                backgroundColor: sf.orange,
              }}
            >
              {uploading ? (
                <ActivityIndicator color={sf.cream} />
              ) : (
                <Text style={{ fontWeight: '700', color: sf.cream }}>
                  Upload {assets?.length ?? 0} photo{(assets?.length ?? 0) === 1 ? '' : 's'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

/* ── Join / Leave bar ─────────────────────────────────────────────────────── */

function JoinBar({ onPress, joining, joined, isPast, insetBottom }: {
  onPress: () => void;
  joining: boolean;
  joined: boolean;
  isPast: boolean;
  insetBottom: number;
}) {
  // Past event + already joined → read-only "attended" badge
  if (isPast && joined) {
    return (
      <View style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        paddingHorizontal: 20,
        paddingBottom: insetBottom + 12,
        paddingTop: 12,
        backgroundColor: sf.cream,
        borderTopWidth: 1,
        borderTopColor: 'rgba(33,34,38,0.08)',
      }}>
        <View style={{
          backgroundColor: sf.white,
          borderRadius: 100,
          paddingVertical: 16,
          alignItems: 'center',
          borderWidth: 2,
          borderColor: sf.grayLight,
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 8,
        }}>
          <Ionicons name="checkmark-circle" size={18} color={sf.orange} />
          <Text style={{ fontSize: 15, fontWeight: '700', color: sf.grayDark, letterSpacing: 0.3 }}>
            You attended this walk
          </Text>
        </View>
      </View>
    );
  }

  // Past event + not joined → show nothing
  if (isPast) return null;

  // Upcoming event → join / leave
  return (
    <View style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      paddingHorizontal: 20,
      paddingBottom: insetBottom + 12,
      paddingTop: 12,
      backgroundColor: sf.cream,
      borderTopWidth: 1,
      borderTopColor: 'rgba(33,34,38,0.08)',
    }}>
      <TouchableOpacity
        onPress={onPress}
        disabled={joining}
        activeOpacity={0.85}
        style={{
          backgroundColor: joined ? sf.white : sf.orange,
          borderRadius: 100,
          paddingVertical: 16,
          alignItems: 'center',
          borderWidth: joined ? 2 : 0,
          borderColor: sf.orange,
        }}
      >
        {joining ? (
          <ActivityIndicator color={joined ? sf.orange : sf.cream} />
        ) : (
          <Text style={{
            fontSize: 15, fontWeight: '700',
            color: joined ? sf.orange : sf.cream,
            letterSpacing: 0.3,
          }}>
            {joined ? 'Leave this walk' : 'Join this walk'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const shadow = {
  shadowColor: 'black',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.1,
  shadowRadius: 5,
} as const;

import * as ImageManipulator from 'expo-image-manipulator';

const MAX_DIMENSION = 400;

export async function imageUriToBase64(uri: string): Promise<string> {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: MAX_DIMENSION, height: MAX_DIMENSION } }],
    { compress: 0.75, format: ImageManipulator.SaveFormat.JPEG, base64: true }
  );

  if (!result.base64) throw new Error('Failed to encode image.');
  return `data:image/jpeg;base64,${result.base64}`;
}

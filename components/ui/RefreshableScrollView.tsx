import React from 'react';
import { RefreshControl, ScrollView, ScrollViewProps } from 'react-native';
import { sf } from '@/constants/theme';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';

interface RefreshableScrollViewProps extends ScrollViewProps {
  /** Called on pull-to-refresh. Omit if the screen's data is already live (e.g. Firestore
   *  subscriptions) — the pull gesture still shows a spinner for feedback. */
  onRefresh?: () => Promise<unknown> | unknown;
}

export const RefreshableScrollView = React.forwardRef<ScrollView, RefreshableScrollViewProps>(
  ({ onRefresh, children, ...rest }, ref) => {
    const { refreshing, handleRefresh } = usePullToRefresh(onRefresh);

    return (
      <ScrollView
        ref={ref}
        {...rest}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={sf.orange}
            colors={[sf.orange]}
          />
        }
      >
        {children}
      </ScrollView>
    );
  }
);
RefreshableScrollView.displayName = 'RefreshableScrollView';

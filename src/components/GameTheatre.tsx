import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Modal, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { theme } from '../theme/theme';

interface Game {
  id: string;
  name: string;
  url: string;
}

interface GameTheatreProps {
  visible: boolean;
  game: Game;
  onClose: () => void;
  onComplete: () => void;
}

export const GameTheatre: React.FC<GameTheatreProps> = ({
  visible,
  game,
  onClose,
  onComplete,
}) => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [isLoading, setIsLoading] = useState(true);
  const [canClaim, setCanClaim] = useState(false);
  const webViewRef = useRef<WebView>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (visible) {
      setTimeLeft(60);
      setIsLoading(true);
      setCanClaim(false);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [visible]);

  useEffect(() => {
    if (!isLoading && visible && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            setCanClaim(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isLoading, visible]);

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  const handleClaim = () => {
    onComplete();
  };

  const handleOpenExternal = () => {
    Linking.openURL(game.url);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Text style={styles.gameTitle}>{game.name}</Text>
          <View style={[styles.timerBadge, canClaim && styles.timerBadgeReady]}>
            <Text style={[styles.timerText, canClaim && styles.timerTextReady]}>
              {canClaim ? '🎉 Ready!' : `⏱️ ${formatTime(timeLeft)}`}
            </Text>
          </View>
        </View>

        <View style={styles.webViewContainer}>
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.loadingText}>Loading game...</Text>
            </View>
          )}
          <WebView
            ref={webViewRef}
            source={{ uri: game.url }}
            style={styles.webView}
            scrollEnabled={false}
            onLoadEnd={handleLoadEnd}
            startInLoadingState={true}
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
          />
        </View>

        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.externalButton}
            onPress={handleOpenExternal}
          >
            <Text style={styles.externalButtonText}>Open in Browser</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.closeButton,
              !canClaim && styles.closeButtonDisabled,
            ]}
            onPress={handleClaim}
            disabled={!canClaim}
          >
            <Text style={[
              styles.closeButtonText,
              !canClaim && styles.closeButtonTextDisabled,
            ]}>
              {canClaim ? 'Finish & Claim +25 XP' : 'Play to unlock reward'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  timerBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  timerBadgeReady: {
    backgroundColor: theme.colors.success,
  },
  timerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  timerTextReady: {
    color: '#fff',
  },
  webViewContainer: {
    flex: 1,
    position: 'relative',
  },
  webView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    zIndex: 10,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  bottomBar: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.background,
    gap: theme.spacing.sm,
  },
  externalButton: {
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
  },
  externalButtonText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  closeButton: {
    backgroundColor: theme.colors.success,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  closeButtonDisabled: {
    backgroundColor: theme.colors.textSecondary + '40',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  closeButtonTextDisabled: {
    color: theme.colors.textSecondary,
  },
});

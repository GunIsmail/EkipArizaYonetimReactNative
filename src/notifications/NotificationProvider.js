import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, SafeAreaView } from 'react-native';
import NotificationManager from './NotificationManager';
import { useColors } from '../constants/ThemeContext';

// Observer/Provider: Manager'a subscribe olur, gelen bildirimleri ekranda gösterir
export default function NotificationProvider({ children }) {
  const AppColors = useColors();
  const styles = useMemo(() => createStyles(AppColors), [AppColors]);

  const [queue, setQueue] = useState([]);
  const timersRef = useRef(new Map());
  const animsRef = useRef(new Map());

  const removeNotification = useCallback((id) => {
    const anim = animsRef.current.get(id);
    const finalize = () => {
      setQueue((prev) => prev.filter((n) => n.id !== id));
      animsRef.current.delete(id);
      const t = timersRef.current.get(id);
      if (t) { clearTimeout(t); timersRef.current.delete(id); }
    };
    if (anim) {
      Animated.timing(anim, { toValue: 0, duration: 200, useNativeDriver: true }).start(finalize);
    } else {
      finalize();
    }
  }, []);

  useEffect(() => {
    const unsubscribe = NotificationManager.subscribe(({ action, notification, notificationId }) => {
      if (action === 'show' && notification) {
        const anim = new Animated.Value(0);
        animsRef.current.set(notification.id, anim);
        setQueue((prev) => [...prev, notification]);
        Animated.timing(anim, { toValue: 1, duration: 250, useNativeDriver: true }).start();
        const timer = setTimeout(() => removeNotification(notification.id), notification.duration);
        timersRef.current.set(notification.id, timer);
      } else if (action === 'dismiss' && notificationId) {
        removeNotification(notificationId);
      }
    });
    return () => {
      unsubscribe();
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current.clear();
    };
  }, [removeNotification]);

  return (
    <View style={{ flex: 1 }}>
      {children}
      <SafeAreaView pointerEvents="box-none" style={styles.overlay}>
        {queue.map((n) => {
          const anim = animsRef.current.get(n.id);
          const accent = AppColors[n.getAccentKey()] || AppColors.primary;
          const translateY = anim
            ? anim.interpolate({ inputRange: [0, 1], outputRange: [-40, 0] })
            : 0;
          return (
            <Animated.View
              key={n.id}
              style={[
                styles.banner,
                { borderLeftColor: accent, opacity: anim || 1, transform: [{ translateY }] },
              ]}
            >
              <Text style={styles.icon}>{n.getIcon()}</Text>
              <View style={styles.textBox}>
                <Text style={styles.title} numberOfLines={1}>{n.title}</Text>
                {!!n.message && <Text style={styles.message} numberOfLines={2}>{n.message}</Text>}
              </View>
              <TouchableOpacity onPress={() => removeNotification(n.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text style={styles.close}>✕</Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </SafeAreaView>
    </View>
  );
}

const createStyles = (c) => StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: c.surface,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
    borderLeftWidth: 5,
    elevation: 6,
    shadowColor: c.black,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  icon: { fontSize: 20, marginRight: 10 },
  textBox: { flex: 1 },
  title: { fontSize: 14, fontWeight: 'bold', color: c.textPrimary },
  message: { fontSize: 12, color: c.textSecondary, marginTop: 2 },
  close: { fontSize: 16, color: c.textSecondary, paddingHorizontal: 6 },
});

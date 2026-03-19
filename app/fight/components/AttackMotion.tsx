'use client';

import { motion, useAnimation } from 'framer-motion';
import { forwardRef, useImperativeHandle, ReactNode } from 'react';

interface AttackMotionProps {
  children: ReactNode;
  direction?: 'left' | 'right'; // 自分のポケモンは右、相手は左に動かすため
}

export interface AttackMotionHandle {
  play: () => Promise<void>;
  dead: () => Promise<void>;
}

const AttackMotion = forwardRef<AttackMotionHandle, AttackMotionProps>(
  ({ children, direction = 'right' }, ref) => {
    const controls = useAnimation();

    // 親から .play() を呼べるようにする
    useImperativeHandle(ref, () => ({
      play: async () => {
        const moveX = direction === 'right' ? 40 : -40;
        await controls.start({
          x: [0, moveX, 0],
          transition: { duration: 0.3, times: [0, 0.2, 1], ease: 'easeInOut' },
        });
      },
      dead: async () => {
        // １８０回転させて、徐々に透明にするアニメーション
        await controls.start({
          rotate: [0, 180],
          opacity: [1, 0],
          transition: { duration: 1, ease: 'easeInOut' },
        });
      },
    }));

    return <motion.div animate={controls}>{children}</motion.div>;
  },
);

AttackMotion.displayName = 'AttackMotion';

export default AttackMotion;

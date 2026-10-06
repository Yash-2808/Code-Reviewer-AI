import { Box, HStack, Text, Badge } from "@chakra-ui/react";
import { motion } from "framer-motion";

/**
 * 3D Volumetric Code Bracket Emblem matching the sunset-violet gradient aesthetic
 */
export const ZenithCodeEmblem = ({ size = 64 }) => {
  return (
    <Box
      as={motion.div}
      whileHover={{ scale: 1.06, rotate: -1 }}
      whileTap={{ scale: 0.95 }}
      position="relative"
      w={`${size}px`}
      h={`${size}px`}
      display="flex"
      alignItems="center"
      justifyContent="center"
      cursor="pointer"
    >
      {/* Multi-layered Neon Ambient Aura Glow */}
      <Box
        position="absolute"
        inset="-6px"
        borderRadius="24px"
        bg="linear-gradient(135deg, rgba(255, 107, 53, 0.45) 0%, rgba(255, 51, 102, 0.45) 45%, rgba(139, 92, 246, 0.5) 100%)"
        filter="blur(16px)"
        opacity={0.85}
        transition="all 0.35s ease"
        _groupHover={{ opacity: 1, filter: "blur(20px)" }}
      />

      {/* Main Glass Pod Container */}
      <Box
        position="relative"
        w="100%"
        h="100%"
        borderRadius="20px"
        bg="linear-gradient(160deg, #181C2E 0%, #0F1220 55%, #080A12 100%)"
        border="1.5px solid rgba(255, 107, 53, 0.35)"
        boxShadow="inset 0 1.5px 2px rgba(255, 255, 255, 0.3), 0 12px 32px rgba(0, 0, 0, 0.75)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
      >
        {/* Holographic light sheen reflection */}
        <Box
          position="absolute"
          top="-50%"
          left="-50%"
          w="200%"
          h="200%"
          bg="linear-gradient(45deg, transparent 40%, rgba(255, 255, 255, 0.14) 50%, transparent 60%)"
          pointerEvents="none"
        />

        {/* 3D Stylized < / > Vector Code Symbol */}
        <svg
          width={size * 0.68}
          height={size * 0.68}
          viewBox="0 0 54 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Left Bracket Gradient: Warm Sunset Orange to Hot Pink */}
            <linearGradient id="zenithBracketLeft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFA057" />
              <stop offset="40%" stopColor="#FF6B35" />
              <stop offset="100%" stopColor="#FF3366" />
            </linearGradient>

            {/* Center Slash Gradient: Hot Pink to Magenta / Fuchsia */}
            <linearGradient id="zenithSlash" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF3366" />
              <stop offset="50%" stopColor="#E02474" />
              <stop offset="100%" stopColor="#C026D3" />
            </linearGradient>

            {/* Right Bracket Gradient: Fuchsia to Violet / Purple */}
            <linearGradient id="zenithBracketRight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C026D3" />
              <stop offset="50%" stopColor="#9333EA" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>

            {/* 3D Drop Shadow Filter for Elements */}
            <filter id="zenith3dShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.75" />
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#FF3366" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Left Bracket < */}
          <path
            d="M20 12L9 27L20 42"
            stroke="url(#zenithBracketLeft)"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#zenith3dShadow)"
          />

          {/* Center Slash / */}
          <path
            d="M31 10L23 44"
            stroke="url(#zenithSlash)"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#zenith3dShadow)"
          />

          {/* Right Bracket > */}
          <path
            d="M34 12L45 27L34 42"
            stroke="url(#zenithBracketRight)"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#zenith3dShadow)"
          />
        </svg>
      </Box>
    </Box>
  );
};

export const LogoIcon = ({ size = 42 }) => {
  return <ZenithCodeEmblem size={size} />;
};

export const BrandLogo = () => {
  return (
    <HStack spacing="3.5" cursor="pointer" role="group">
      <LogoIcon size={44} />
      <Box display="flex" flexDirection="column" alignItems="flex-start">
        <HStack spacing="2" align="center">
          <Text
            fontFamily="'Outfit', 'Plus Jakarta Sans', sans-serif"
            fontWeight="900"
            fontSize="1.38rem"
            letterSpacing="-0.02em"
            lineHeight="1.1"
            bg="linear-gradient(135deg, #FFA057 0%, #FF6B35 25%, #FF3366 50%, #C026D3 75%, #9333EA 100%)"
            bgClip="text"
          >
            CodeReviewer
          </Text>
          <Badge
            px="2"
            py="0.5"
            borderRadius="md"
            fontSize="11px"
            fontWeight="900"
            letterSpacing="0.08em"
            bg="linear-gradient(135deg, rgba(255, 107, 53, 0.25), rgba(192, 38, 211, 0.25))"
            color="#FFA057"
            border="1px solid rgba(255, 107, 53, 0.45)"
            boxShadow="0 0 12px rgba(255, 107, 53, 0.3)"
          >
            AI
          </Badge>
        </HStack>
        <Text
          fontSize="11px"
          fontWeight="600"
          letterSpacing="0.03em"
          color="rgba(160, 174, 192, 0.9)"
        >
          AI-Powered Code Intelligence
        </Text>
      </Box>
    </HStack>
  );
};

export default BrandLogo;

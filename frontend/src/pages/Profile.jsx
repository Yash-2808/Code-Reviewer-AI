import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  HStack,
  VStack,
  Badge,
  Divider,
  Container,
} from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import {
  FaUser,
  FaEnvelope,
  FaShieldAlt,
  FaCalendarAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info("Logged out successfully.");
    navigate("/login");
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently";

  return (
    <Container maxW="container.md" py="6">
      {/* Profile Header Card */}
      <Box
        as={motion.div}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="hero-glass-panel"
        p={{ base: "6", md: "8" }}
        mb="6"
        borderRadius="24px"
      >
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "start", md: "center" }}
          gap="5"
        >
          <HStack spacing="4" align="center">
            <Box
              w="64px"
              h="64px"
              borderRadius="20px"
              bg="linear-gradient(135deg, #FFA057, #FF3366, #9333EA)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
              fontSize="28px"
              fontWeight="900"
              boxShadow="0 8px 25px rgba(255, 107, 53, 0.35)"
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </Box>

            <VStack align="start" spacing="1">
              <HStack spacing="2">
                <Heading size="md" color="white" fontWeight="900">
                  {user?.name || "Developer"}
                </Heading>
                <Badge
                  colorScheme={user?.role === "admin" ? "purple" : "cyan"}
                  borderRadius="md"
                  px="2"
                  py="0.5"
                  fontSize="11px"
                  fontWeight="800"
                >
                  {user?.role ? user.role.toUpperCase() : "USER"}
                </Badge>
              </HStack>
              <Text fontSize="xs" color="gray.400">
                {user?.email}
              </Text>
            </VStack>
          </HStack>

          <Button
            size="sm"
            color="red.300"
            variant="ghost"
            _hover={{ bg: "rgba(255, 51, 102, 0.15)", color: "#FF3366" }}
            leftIcon={<FaSignOutAlt />}
            onClick={handleLogout}
            borderRadius="xl"
          >
            Sign Out
          </Button>
        </Flex>
      </Box>

      {/* Account Details Card */}
      <Box
        as={motion.div}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="hero-glass-panel"
        p={{ base: "6", md: "8" }}
        borderRadius="22px"
      >
        <Heading size="xs" color="#FFA057" mb="5" textTransform="uppercase" letterSpacing="0.08em">
          Account Information
        </Heading>

        <VStack spacing="4" align="stretch">
          <Flex justify="space-between" align="center">
            <HStack spacing="2.5" color="gray.400" fontSize="xs">
              <FaUser color="#FF6B35" />
              <Text>Display Name:</Text>
            </HStack>
            <Text fontSize="xs" color="white" fontWeight="700">
              {user?.name}
            </Text>
          </Flex>
          <Divider borderColor="rgba(255,255,255,0.06)" />

          <Flex justify="space-between" align="center">
            <HStack spacing="2.5" color="gray.400" fontSize="xs">
              <FaEnvelope color="#FF3366" />
              <Text>Email Address:</Text>
            </HStack>
            <Text fontSize="xs" color="white" fontWeight="700">
              {user?.email}
            </Text>
          </Flex>
          <Divider borderColor="rgba(255,255,255,0.06)" />

          <Flex justify="space-between" align="center">
            <HStack spacing="2.5" color="gray.400" fontSize="xs">
              <FaShieldAlt color="#C026D3" />
              <Text>Authorization Role:</Text>
            </HStack>
            <Badge colorScheme="cyan" textTransform="uppercase" fontSize="10px" px="2" py="0.5" borderRadius="md">
              {user?.role || "user"}
            </Badge>
          </Flex>
          <Divider borderColor="rgba(255,255,255,0.06)" />

          <Flex justify="space-between" align="center">
            <HStack spacing="2.5" color="gray.400" fontSize="xs">
              <FaCalendarAlt color="#9333EA" />
              <Text>Member Since:</Text>
            </HStack>
            <Text fontSize="xs" color="gray.300" fontWeight="600">
              {memberSince}
            </Text>
          </Flex>
        </VStack>
      </Box>
    </Container>
  );
};

export default Profile;

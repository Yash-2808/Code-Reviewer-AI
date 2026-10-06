import { useState } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Box,
  Flex,
  Heading,
  Text,
  Input,
  Button,
  VStack,
  HStack,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  Alert,
  AlertIcon,
  Container,
  Badge,
} from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import { FaEnvelope, FaLock, FaArrowRight, FaShieldAlt } from "react-icons/fa";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { ZenithCodeEmblem } from "../components/Logo";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      toast.success("Welcome back to CodeReviewer AI!");
      navigate(from, { replace: true });
    } catch (error) {
      const msg = error.response?.data?.error || "Invalid email or password.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      position="relative"
      minH="calc(100vh - 140px)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      py={{ base: "8", md: "14" }}
      px="4"
    >
      {/* Background Ambient Radial Glows */}
      <Box
        position="absolute"
        top="20%"
        left="50%"
        transform="translateX(-50%)"
        w={{ base: "320px", md: "520px" }}
        h={{ base: "320px", md: "520px" }}
        borderRadius="full"
        bg="radial-gradient(circle, rgba(255, 107, 53, 0.15) 0%, rgba(224, 36, 116, 0.12) 40%, rgba(124, 58, 237, 0.08) 70%, transparent 80%)"
        filter="blur(50px)"
        pointerEvents="none"
        zIndex={0}
      />

      <Container maxW="460px" position="relative" zIndex={1}>
        <Box
          as={motion.div}
          initial={{ opacity: 0, y: 25, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          position="relative"
          bg="rgba(13, 16, 28, 0.82)"
          backdropFilter="blur(28px) saturate(2)"
          borderRadius="28px"
          p={{ base: "7", md: "9" }}
          border="1px solid rgba(255, 107, 53, 0.22)"
          boxShadow="0 24px 60px rgba(0, 0, 0, 0.75), 0 0 35px rgba(255, 107, 53, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.15)"
        >
          {/* Subtle Top Glowing Line */}
          <Box
            position="absolute"
            top="0"
            left="15%"
            right="15%"
            h="2px"
            bg="linear-gradient(90deg, transparent, #FF6B35 25%, #E02474 50%, #7C3AED 75%, transparent)"
            borderRadius="full"
          />

          <VStack spacing="6" align="stretch">
            {/* Top 3D Brand Logo Header */}
            <VStack spacing="3" align="center" textAlign="center">
              <ZenithCodeEmblem size={72} />

              <VStack spacing="1">
                <HStack spacing="2" justify="center">
                  <Heading
                    as="h2"
                    fontSize={{ base: "1.65rem", md: "1.85rem" }}
                    fontFamily="'Outfit', sans-serif"
                    fontWeight="900"
                    letterSpacing="-0.02em"
                    bg="linear-gradient(135deg, #FFA057 0%, #FF6B35 25%, #FF3366 50%, #C026D3 75%, #9333EA 100%)"
                    bgClip="text"
                  >
                    CodeReviewer
                  </Heading>
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
                  >
                    AI
                  </Badge>
                </HStack>

                <Text fontSize="xs" color="gray.400" fontWeight="500">
                  Sign in to access your intelligent code studio & review history
                </Text>
              </VStack>
            </VStack>

            {/* Error Message */}
            {errorMessage && (
              <Alert
                status="error"
                borderRadius="14px"
                bg="rgba(255, 51, 102, 0.12)"
                border="1px solid rgba(255, 51, 102, 0.35)"
                color="#FF6B8B"
                fontSize="xs"
                py="2.5"
                px="3.5"
              >
                <AlertIcon color="#FF3366" />
                {errorMessage}
              </Alert>
            )}

            {/* Form */}
            <Box as="form" onSubmit={handleSubmit}>
              <VStack spacing="4" align="stretch">
                {/* Email Field */}
                <Box>
                  <Text
                    fontSize="11px"
                    fontWeight="700"
                    color="gray.300"
                    mb="1.5"
                    textTransform="uppercase"
                    letterSpacing="0.06em"
                  >
                    Email Address
                  </Text>
                  <InputGroup size="md">
                    <InputLeftElement pointerEvents="none" color="gray.500" fontSize="sm">
                      <FaEnvelope />
                    </InputLeftElement>
                    <Input
                      type="email"
                      placeholder="developer@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      bg="rgba(18, 22, 38, 0.85)"
                      borderColor="rgba(255, 255, 255, 0.1)"
                      _hover={{ borderColor: "rgba(255, 107, 53, 0.5)" }}
                      _focus={{
                        borderColor: "#FF6B35",
                        boxShadow: "0 0 0 1px #FF6B35, 0 0 16px rgba(255, 107, 53, 0.25)",
                        bg: "rgba(20, 25, 45, 0.95)",
                      }}
                      borderRadius="14px"
                      color="white"
                      fontSize="sm"
                      autoComplete="email"
                      required
                    />
                  </InputGroup>
                </Box>

                {/* Password Field */}
                <Box>
                  <Text
                    fontSize="11px"
                    fontWeight="700"
                    color="gray.300"
                    mb="1.5"
                    textTransform="uppercase"
                    letterSpacing="0.06em"
                  >
                    Password
                  </Text>
                  <InputGroup size="md">
                    <InputLeftElement pointerEvents="none" color="gray.500" fontSize="sm">
                      <FaLock />
                    </InputLeftElement>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      bg="rgba(18, 22, 38, 0.85)"
                      borderColor="rgba(255, 255, 255, 0.1)"
                      _hover={{ borderColor: "rgba(255, 107, 53, 0.5)" }}
                      _focus={{
                        borderColor: "#FF6B35",
                        boxShadow: "0 0 0 1px #FF6B35, 0 0 16px rgba(255, 107, 53, 0.25)",
                        bg: "rgba(20, 25, 45, 0.95)",
                      }}
                      borderRadius="14px"
                      color="white"
                      fontSize="sm"
                      autoComplete="current-password"
                      required
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label="Toggle password view"
                        icon={showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                        size="xs"
                        variant="ghost"
                        color="gray.400"
                        _hover={{ color: "white", bg: "transparent" }}
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    </InputRightElement>
                  </InputGroup>
                </Box>

                {/* Login Button */}
                <Button
                  type="submit"
                  size="lg"
                  h="48px"
                  mt="2"
                  bg="linear-gradient(135deg, #FFA057 0%, #FF6B35 25%, #FF3366 55%, #9333EA 100%)"
                  _hover={{
                    bg: "linear-gradient(135deg, #FFB273 0%, #FF7B4A 25%, #FF4D7B 55%, #A855F7 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 10px 30px rgba(255, 107, 53, 0.45), 0 0 20px rgba(147, 51, 234, 0.35)",
                  }}
                  _active={{ transform: "translateY(0)" }}
                  color="white"
                  fontWeight="800"
                  fontSize="sm"
                  letterSpacing="0.02em"
                  borderRadius="14px"
                  boxShadow="0 8px 24px rgba(255, 107, 53, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3)"
                  isLoading={loading}
                  loadingText="Signing In..."
                  rightIcon={<FaArrowRight />}
                >
                  Sign In to Studio
                </Button>
              </VStack>
            </Box>

            {/* Bottom Footer & Switch Link */}
            <VStack spacing="3" pt="2" borderTop="1px solid rgba(255, 255, 255, 0.08)">
              <Text fontSize="xs" color="gray.400">
                Don't have an account?{" "}
                <Text
                  as={RouterLink}
                  to="/register"
                  fontWeight="800"
                  bg="linear-gradient(135deg, #FFA057, #FF3366)"
                  bgClip="text"
                  _hover={{ textDecoration: "underline" }}
                >
                  Create an account
                </Text>
              </Text>

              <HStack spacing="2" color="gray.500" fontSize="11px">
                <FaShieldAlt />
                <Text>256-bit Encrypted Private Session</Text>
              </HStack>
            </VStack>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;

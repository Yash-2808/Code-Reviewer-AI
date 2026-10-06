import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Flex,
  Box,
  HStack,
  Text,
  Button,
  IconButton,
  Tooltip,
  Select,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Badge,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Alert,
  AlertIcon,
  VStack,
} from "@chakra-ui/react";
import { BrandLogo } from "./Logo";
import { useAuth } from "../context/AuthContext";
import { codeThemes } from "../constants";
import {
  FaUserCircle,
  FaSignOutAlt,
  FaHistory,
  FaChartPie,
  FaCode,
  FaCog,
  FaUser,
} from "react-icons/fa";
import { MdOutlineKey, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { toast } from "react-toastify";

const Navbar = ({ editorTheme, setEditorTheme }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Settings Modal State
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userKey, setUserKey] = useState("");
  const [showKeyPassword, setShowKeyPassword] = useState(false);
  const [isKeySaved, setIsKeySaved] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem("gemini_user_key");
    if (savedKey) {
      setUserKey(savedKey);
      setIsKeySaved(true);
    }
  }, []);

  const saveApiKey = () => {
    if (userKey.trim() === "") {
      localStorage.removeItem("gemini_user_key");
      setIsKeySaved(false);
      toast.info("Custom API key removed. Using default server key.");
    } else {
      localStorage.setItem("gemini_user_key", userKey.trim());
      setIsKeySaved(true);
      toast.success("Gemini API Key configured successfully!");
    }
    onClose();
  };

  const clearApiKey = () => {
    setUserKey("");
    localStorage.removeItem("gemini_user_key");
    setIsKeySaved(false);
    toast.info("Custom API key removed.");
    onClose();
  };

  const handleLogout = () => {
    logout();
    toast.info("Logged out successfully.");
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <Flex
        as={motion.nav}
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        justifyContent="space-between"
        alignItems="center"
        mb="5"
        p={{ base: "3", md: "3.5" }}
        className="navbar-hero-glass"
        flexWrap="wrap"
        gap="3"
      >
        {/* Brand Logo */}
        <Box as={Link} to={isAuthenticated ? "/dashboard" : "/login"}>
          <BrandLogo />
        </Box>

        {/* Center / Navigation Links for Authenticated Users */}
        {isAuthenticated && (
          <HStack spacing={{ base: "1", md: "2" }} display={{ base: "none", md: "flex" }}>
            <Button
              as={Link}
              to="/dashboard"
              size="sm"
              variant={isActive("/dashboard") ? "solid" : "ghost"}
              bg={isActive("/dashboard") ? "rgba(0, 242, 254, 0.15)" : "transparent"}
              color={isActive("/dashboard") ? "#00F2FE" : "gray.300"}
              border={isActive("/dashboard") ? "1px solid rgba(0, 242, 254, 0.4)" : "1px solid transparent"}
              _hover={{ bg: "rgba(0, 242, 254, 0.1)", color: "#00F2FE" }}
              leftIcon={<FaChartPie />}
              fontSize="xs"
              fontWeight="700"
              borderRadius="xl"
            >
              Dashboard
            </Button>

            <Button
              as={Link}
              to="/studio"
              size="sm"
              variant={isActive("/studio") || isActive("/converter") || isActive("/debugger") || isActive("/quality") ? "solid" : "ghost"}
              bg={isActive("/studio") || isActive("/converter") || isActive("/debugger") || isActive("/quality") ? "rgba(112, 101, 240, 0.18)" : "transparent"}
              color={isActive("/studio") || isActive("/converter") || isActive("/debugger") || isActive("/quality") ? "#7065F0" : "gray.300"}
              border={isActive("/studio") || isActive("/converter") || isActive("/debugger") || isActive("/quality") ? "1px solid rgba(112, 101, 240, 0.4)" : "1px solid transparent"}
              _hover={{ bg: "rgba(112, 101, 240, 0.12)", color: "#7065F0" }}
              leftIcon={<FaCode />}
              fontSize="xs"
              fontWeight="700"
              borderRadius="xl"
            >
              Code Studio
            </Button>

            <Button
              as={Link}
              to="/history"
              size="sm"
              variant={isActive("/history") ? "solid" : "ghost"}
              bg={isActive("/history") ? "rgba(16, 185, 129, 0.15)" : "transparent"}
              color={isActive("/history") ? "#00D2D3" : "gray.300"}
              border={isActive("/history") ? "1px solid rgba(0, 210, 211, 0.4)" : "1px solid transparent"}
              _hover={{ bg: "rgba(16, 185, 129, 0.1)", color: "#00D2D3" }}
              leftIcon={<FaHistory />}
              fontSize="xs"
              fontWeight="700"
              borderRadius="xl"
            >
              History
            </Button>

            <Button
              as={Link}
              to="/profile"
              size="sm"
              variant={isActive("/profile") ? "solid" : "ghost"}
              bg={isActive("/profile") ? "rgba(254, 202, 87, 0.15)" : "transparent"}
              color={isActive("/profile") ? "#FECA57" : "gray.300"}
              border={isActive("/profile") ? "1px solid rgba(254, 202, 87, 0.4)" : "1px solid transparent"}
              _hover={{ bg: "rgba(254, 202, 87, 0.1)", color: "#FECA57" }}
              leftIcon={<FaUser />}
              fontSize="xs"
              fontWeight="700"
              borderRadius="xl"
            >
              Profile
            </Button>
          </HStack>
        )}

        {/* Right Side Navigation Tools */}
        <HStack spacing={{ base: "2", md: "3" }}>
          {/* Status Beacon */}
          <HStack
            spacing="2"
            bg="rgba(0, 242, 254, 0.08)"
            px="3"
            py="1.5"
            borderRadius="full"
            border="1px solid rgba(0, 242, 254, 0.25)"
            display={{ base: "none", lg: "flex" }}
          >
            <Box className="hero-status-beacon" />
            <Text fontSize="10px" color="#00F2FE" fontWeight="800" letterSpacing="0.05em">
              AI ONLINE
            </Text>
          </HStack>

          {/* Theme Selector (if available) */}
          {setEditorTheme && (
            <HStack
              spacing="1"
              bg="rgba(18, 24, 48, 0.9)"
              px="2.5"
              py="1.5"
              borderRadius="xl"
              border="1px solid rgba(112, 101, 240, 0.25)"
              display={{ base: "none", sm: "flex" }}
            >
              <Text fontSize="10px" color="gray.400" fontWeight="700">Theme</Text>
              <Select
                size="xs"
                variant="unstyled"
                color="#00F2FE"
                fontWeight="800"
                onChange={(e) => setEditorTheme(e.target.value)}
                value={editorTheme}
                w="100px"
                cursor="pointer"
              >
                {codeThemes.map((themeName) => (
                  <option
                    key={themeName}
                    value={themeName}
                    style={{ background: "#0D1122", color: "#F1F5F9" }}
                  >
                    {themeName.replace("_", " ")}
                  </option>
                ))}
              </Select>
            </HStack>
          )}

          {/* API Key Modal Button */}
          <Tooltip
            label={isKeySaved ? "Custom API Key Active" : "Configure Custom API Key"}
            placement="bottom"
          >
            <IconButton
              aria-label="Settings"
              icon={<FaCog />}
              size="sm"
              bg="rgba(18, 24, 48, 0.9)"
              border="1px solid rgba(112, 101, 240, 0.25)"
              _hover={{ bg: "rgba(112, 101, 240, 0.2)", borderColor: "#00F2FE", color: "#00F2FE" }}
              onClick={onOpen}
              color={isKeySaved ? "#00D2D3" : "gray.300"}
              borderRadius="xl"
            />
          </Tooltip>

          {/* Auth Controls */}
          {isAuthenticated ? (
            <Menu>
              <MenuButton
                as={Button}
                size="sm"
                bg="linear-gradient(135deg, rgba(112, 101, 240, 0.2), rgba(0, 242, 254, 0.2))"
                border="1px solid rgba(0, 242, 254, 0.35)"
                _hover={{ bg: "linear-gradient(135deg, rgba(112, 101, 240, 0.3), rgba(0, 242, 254, 0.3))" }}
                borderRadius="xl"
                px="3"
              >
                <HStack spacing="2">
                  <Box color="#00F2FE"><FaUserCircle /></Box>
                  <Text fontSize="xs" fontWeight="800" color="white" maxW="100px" isTruncated>
                    {user?.name || "Account"}
                  </Text>
                  {user?.role === "admin" && (
                    <Badge fontSize="9px" colorScheme="purple" borderRadius="md" px="1">
                      ADMIN
                    </Badge>
                  )}
                </HStack>
              </MenuButton>

              <MenuList
                bg="#0D1122"
                borderColor="rgba(112, 101, 240, 0.3)"
                boxShadow="0 14px 40px rgba(0,0,0,0.7)"
                p="2"
                borderRadius="xl"
                zIndex="20"
              >
                <Box px="3" py="2">
                  <Text fontSize="xs" fontWeight="800" color="white">
                    {user?.name}
                  </Text>
                  <Text fontSize="11px" color="gray.400">
                    {user?.email}
                  </Text>
                </Box>
                <MenuDivider borderColor="rgba(255,255,255,0.08)" />

                <MenuItem
                  as={Link}
                  to="/dashboard"
                  bg="#0D1122"
                  _hover={{ bg: "rgba(0, 242, 254, 0.15)", color: "#00F2FE" }}
                  borderRadius="lg"
                  fontSize="xs"
                  fontWeight="600"
                  icon={<FaChartPie />}
                >
                  Dashboard
                </MenuItem>

                <MenuItem
                  as={Link}
                  to="/studio"
                  bg="#0D1122"
                  _hover={{ bg: "rgba(112, 101, 240, 0.15)", color: "#7065F0" }}
                  borderRadius="lg"
                  fontSize="xs"
                  fontWeight="600"
                  icon={<FaCode />}
                >
                  Code Studio
                </MenuItem>

                <MenuItem
                  as={Link}
                  to="/history"
                  bg="#0D1122"
                  _hover={{ bg: "rgba(0, 210, 211, 0.15)", color: "#00D2D3" }}
                  borderRadius="lg"
                  fontSize="xs"
                  fontWeight="600"
                  icon={<FaHistory />}
                >
                  Review History
                </MenuItem>

                <MenuItem
                  as={Link}
                  to="/profile"
                  bg="#0D1122"
                  _hover={{ bg: "rgba(254, 202, 87, 0.15)", color: "#FECA57" }}
                  borderRadius="lg"
                  fontSize="xs"
                  fontWeight="600"
                  icon={<FaUser />}
                >
                  Profile & Settings
                </MenuItem>

                <MenuDivider borderColor="rgba(255,255,255,0.08)" />

                <MenuItem
                  onClick={handleLogout}
                  bg="#0D1122"
                  _hover={{ bg: "rgba(255, 51, 102, 0.15)", color: "#FF3366" }}
                  color="#FF3366"
                  borderRadius="lg"
                  fontSize="xs"
                  fontWeight="700"
                  icon={<FaSignOutAlt />}
                >
                  Sign Out
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <HStack spacing="2">
              <Button
                as={Link}
                to="/login"
                size="sm"
                variant="ghost"
                color="gray.300"
                _hover={{ color: "#00F2FE", bg: "rgba(0, 242, 254, 0.1)" }}
                fontWeight="700"
                fontSize="xs"
                borderRadius="xl"
              >
                Sign In
              </Button>
              <Button
                as={Link}
                to="/register"
                size="sm"
                className="btn-hero-primary"
                fontWeight="800"
                fontSize="xs"
                borderRadius="xl"
                px="4"
              >
                Register
              </Button>
            </HStack>
          )}
        </HStack>
      </Flex>

      {/* Gemini API Key Configuration Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="md" motionPreset="slideInBottom">
        <ModalOverlay backdropFilter="blur(18px)" bg="rgba(0,0,0,0.65)" />
        <ModalContent
          className="modal-hero-glass"
          borderRadius="2xl"
          p="2"
          bg="#0D1122"
          border="1px solid rgba(112, 101, 240, 0.3)"
        >
          <ModalHeader color="white" borderBottom="1px solid rgba(112, 101, 240, 0.15)" fontSize="md" fontWeight="800">
            <HStack spacing="2">
              <Box color="#00F2FE"><MdOutlineKey /></Box>
              <Text>Gemini API Settings</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="gray.400" />

          <ModalBody py="6">
            <VStack spacing="4" align="stretch">
              <Text fontSize="sm" color="gray.300">
                Configure your personal Google Gemini API key to run queries using your own quota.
              </Text>

              <Alert
                status="info"
                borderRadius="xl"
                bg="rgba(112, 101, 240, 0.1)"
                border="1px solid rgba(112, 101, 240, 0.3)"
              >
                <AlertIcon color="#00F2FE" />
                <Box fontSize="xs" color="gray.300">
                  Keys are stored purely on your local browser (<code style={{ color: "#00F2FE" }}>localStorage</code>) and sent via direct headers.
                </Box>
              </Alert>

              <Box>
                <Text fontSize="xs" color="gray.400" mb="2" fontWeight="700" textTransform="uppercase" letterSpacing="wider">
                  Google Gemini API Key
                </Text>
                <InputGroup size="md">
                  <InputLeftElement pointerEvents="none" color="gray.500">
                    <MdOutlineKey />
                  </InputLeftElement>
                  <Input
                    placeholder="AIzaSy..."
                    type={showKeyPassword ? "text" : "password"}
                    value={userKey}
                    onChange={(e) => setUserKey(e.target.value)}
                    bg="rgba(18, 24, 48, 0.9)"
                    borderColor="rgba(112, 101, 240, 0.25)"
                    _hover={{ borderColor: "#00F2FE" }}
                    _focus={{ borderColor: "#00F2FE", boxShadow: "0 0 0 1px #00F2FE, 0 0 15px rgba(0, 242, 254, 0.3)" }}
                    borderRadius="xl"
                    color="white"
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label="Toggle password view"
                      icon={showKeyPassword ? <MdVisibilityOff /> : <MdVisibility />}
                      size="xs"
                      variant="ghost"
                      color="gray.400"
                      onClick={() => setShowKeyPassword(!showKeyPassword)}
                    />
                  </InputRightElement>
                </InputGroup>
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter borderTop="1px solid rgba(112, 101, 240, 0.15)">
            <Button
              size="sm"
              color="red.300"
              variant="ghost"
              mr="auto"
              onClick={clearApiKey}
              isDisabled={!isKeySaved}
              _hover={{ bg: "rgba(255, 51, 102, 0.15)" }}
            >
              Clear Key
            </Button>
            <Button size="sm" color="gray.400" variant="ghost" mr={3} onClick={onClose} _hover={{ bg: "rgba(255, 255, 255, 0.08)" }}>
              Cancel
            </Button>
            <Button size="sm" className="btn-hero-primary" onClick={saveApiKey} borderRadius="xl" px="5">
              Save Key
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Navbar;

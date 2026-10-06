import { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Grid,
  GridItem,
  HStack,
  VStack,
  Badge,
  IconButton,
  Tooltip,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Alert,
  AlertIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import { getMyStatsApi, getMyReviewsApi, deleteReviewApi } from "../api";
import CodeEditor from "../components/CodeEditor";
import {
  FaChartPie,
  FaRocket,
  FaBolt,
  FaShieldAlt,
  FaCode,
  FaTrashAlt,
  FaEye,
  FaPlus,
  FaArrowRight,
  FaCalendarAlt,
} from "react-icons/fa";
import { CgArrowsExchange } from "react-icons/cg";
import { VscDebugAll } from "react-icons/vsc";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ total: 0, convert: 0, debug: 0, codeQuality: 0 });
  const [recentReviews, setRecentReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected review for preview modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedReview, setSelectedReview] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, reviewsRes] = await Promise.all([
        getMyStatsApi(),
        getMyReviewsApi(),
      ]);

      if (statsRes.data?.stats) {
        setStats(statsRes.data.stats);
      }
      if (reviewsRes.data?.reviews) {
        setRecentReviews(reviewsRes.data.reviews.slice(0, 5));
      }
    } catch (error) {
      console.error("Dashboard data fetch failed:", error);
      toast.error("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteReview = async (id, e) => {
    e?.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await deleteReviewApi(id);
      toast.success("Review deleted successfully.");
      setRecentReviews((prev) => prev.filter((r) => r._id !== id));
      setStats((prev) => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
      }));
      if (selectedReview?._id === id) {
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to delete review.");
    }
  };

  const handleOpenReview = (review) => {
    setSelectedReview(review);
    onOpen();
  };

  const handleOpenInStudio = (review) => {
    onClose();
    navigate("/studio", { state: { loadReview: review } });
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case "convert":
        return (
          <Badge bg="rgba(112, 101, 240, 0.25)" color="#7065F0" border="1px solid rgba(112, 101, 240, 0.4)" px="2" py="0.5" borderRadius="md">
            Convert
          </Badge>
        );
      case "debug":
        return (
          <Badge bg="rgba(255, 51, 102, 0.25)" color="#FF3366" border="1px solid rgba(255, 51, 102, 0.4)" px="2" py="0.5" borderRadius="md">
            Debug
          </Badge>
        );
      case "codeQuality":
        return (
          <Badge bg="rgba(0, 210, 211, 0.25)" color="#00D2D3" border="1px solid rgba(0, 210, 211, 0.4)" px="2" py="0.5" borderRadius="md">
            Quality
          </Badge>
        );
      default:
        return <Badge>{type}</Badge>;
    }
  };

  return (
    <Box py="2">
      {/* Welcome Banner */}
      <Box
        as={motion.div}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="hero-glass-panel"
        p={{ base: "5", md: "6" }}
        mb="6"
        borderRadius="24px"
      >
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "start", md: "center" }}
          gap="4"
        >
          <VStack align="start" spacing="1">
            <HStack spacing="2">
              <Heading
                as="h1"
                fontSize={{ base: "1.5rem", md: "1.85rem" }}
                fontFamily="'Outfit', sans-serif"
                fontWeight="900"
                className="text-hero-gradient"
              >
                Welcome back, {user?.name || "Developer"}!
              </Heading>
              {user?.role === "admin" && (
                <Badge colorScheme="purple" borderRadius="full" px="2.5" py="0.5" fontSize="10px">
                  ADMINISTRATOR
                </Badge>
              )}
            </HStack>
          </VStack>

          <Button
            as={RouterLink}
            to="/studio"
            className="btn-hero-primary"
            size="md"
            leftIcon={<FaPlus />}
            px="5"
            fontSize="sm"
          >
            New AI Review
          </Button>
        </Flex>
      </Box>

      {/* Metrics Statistics Grid */}
      <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap="4" mb="6">
        {/* Total Reviews */}
        <Box
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="hero-glass-panel"
          p="5"
          borderRadius="20px"
        >
          <Flex justify="space-between" align="start">
            <VStack align="start" spacing="1">
              <Text fontSize="xs" fontWeight="700" color="gray.400" textTransform="uppercase" letterSpacing="0.05em">
                Total Analyses
              </Text>
              <Heading size="lg" color="white" fontWeight="900">
                {loading ? <Spinner size="sm" color="#00F2FE" /> : stats.total}
              </Heading>
              <Text fontSize="11px" color="gray.500">
                All time AI reviews
              </Text>
            </VStack>
            <Box p="3" borderRadius="xl" bg="rgba(0, 242, 254, 0.12)" color="#00F2FE" fontSize="20px">
              <FaChartPie />
            </Box>
          </Flex>
        </Box>

        {/* Code Conversions */}
        <Box
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="hero-glass-panel"
          p="5"
          borderRadius="20px"
        >
          <Flex justify="space-between" align="start">
            <VStack align="start" spacing="1">
              <Text fontSize="xs" fontWeight="700" color="gray.400" textTransform="uppercase" letterSpacing="0.05em">
                Code Conversions
              </Text>
              <Heading size="lg" color="#7065F0" fontWeight="900">
                {loading ? <Spinner size="sm" color="#7065F0" /> : stats.convert}
              </Heading>
              <Text fontSize="11px" color="gray.500">
                Language translations
              </Text>
            </VStack>
            <Box p="3" borderRadius="xl" bg="rgba(112, 101, 240, 0.12)" color="#7065F0" fontSize="20px">
              <CgArrowsExchange />
            </Box>
          </Flex>
        </Box>

        {/* Bug Hunts */}
        <Box
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="hero-glass-panel"
          p="5"
          borderRadius="20px"
        >
          <Flex justify="space-between" align="start">
            <VStack align="start" spacing="1">
              <Text fontSize="xs" fontWeight="700" color="gray.400" textTransform="uppercase" letterSpacing="0.05em">
                Bug Hunts
              </Text>
              <Heading size="lg" color="#FF3366" fontWeight="900">
                {loading ? <Spinner size="sm" color="#FF3366" /> : stats.debug}
              </Heading>
              <Text fontSize="11px" color="gray.500">
                Scanned & fixed code
              </Text>
            </VStack>
            <Box p="3" borderRadius="xl" bg="rgba(255, 51, 102, 0.12)" color="#FF3366" fontSize="20px">
              <VscDebugAll />
            </Box>
          </Flex>
        </Box>

        {/* Quality Audits */}
        <Box
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="hero-glass-panel"
          p="5"
          borderRadius="20px"
        >
          <Flex justify="space-between" align="start">
            <VStack align="start" spacing="1">
              <Text fontSize="xs" fontWeight="700" color="gray.400" textTransform="uppercase" letterSpacing="0.05em">
                Quality Audits
              </Text>
              <Heading size="lg" color="#00D2D3" fontWeight="900">
                {loading ? <Spinner size="sm" color="#00D2D3" /> : stats.codeQuality}
              </Heading>
              <Text fontSize="11px" color="gray.500">
                Maintainability & security
              </Text>
            </VStack>
            <Box p="3" borderRadius="xl" bg="rgba(0, 210, 211, 0.12)" color="#00D2D3" fontSize="20px">
              <BsFillPatchCheckFill />
            </Box>
          </Flex>
        </Box>
      </Grid>

      {/* Quick Launch Studio Modes */}
      <Box mb="6">
        <Text fontSize="xs" fontWeight="800" color="gray.400" textTransform="uppercase" letterSpacing="0.06em" mb="3">
          Launch AI Studio Modes
        </Text>
        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap="4">
          {/* Converter Mode Card */}
          <Box
            as={RouterLink}
            to="/studio"
            state={{ defaultTab: 0 }}
            className="hero-glass-panel"
            p="5"
            borderRadius="20px"
            role="group"
            _hover={{ transform: "translateY(-3px)" }}
            cursor="pointer"
          >
            <VStack align="start" spacing="3">
              <HStack justify="space-between" w="full">
                <Box p="2.5" borderRadius="xl" bg="rgba(112, 101, 240, 0.2)" color="#7065F0" fontSize="20px">
                  <FaRocket />
                </Box>
                <Box color="gray.500" _groupHover={{ color: "#00F2FE", transform: "translateX(3px)" }} transition="all 0.2s">
                  <FaArrowRight />
                </Box>
              </HStack>
              <Box>
                <Heading size="xs" color="white" fontWeight="800" mb="1">
                  Code Converter
                </Heading>
                <Text fontSize="xs" color="gray.400">
                  Translate across 14+ languages (JavaScript, Python, TypeScript, Java, C++, and more)
                </Text>
              </Box>
            </VStack>
          </Box>

          {/* Debugger Mode Card */}
          <Box
            as={RouterLink}
            to="/studio"
            state={{ defaultTab: 1 }}
            className="hero-glass-panel"
            p="5"
            borderRadius="20px"
            role="group"
            _hover={{ transform: "translateY(-3px)" }}
            cursor="pointer"
          >
            <VStack align="start" spacing="3">
              <HStack justify="space-between" w="full">
                <Box p="2.5" borderRadius="xl" bg="rgba(255, 51, 102, 0.2)" color="#FF3366" fontSize="20px">
                  <FaBolt />
                </Box>
                <Box color="gray.500" _groupHover={{ color: "#FF3366", transform: "translateX(3px)" }} transition="all 0.2s">
                  <FaArrowRight />
                </Box>
              </HStack>
              <Box>
                <Heading size="xs" color="white" fontWeight="800" mb="1">
                  Bug Hunter & Fixer
                </Heading>
                <Text fontSize="xs" color="gray.400">
                  Detect runtime crashes, logical bugs, syntax errors, and generate automated patches
                </Text>
              </Box>
            </VStack>
          </Box>

          {/* Quality Mode Card */}
          <Box
            as={RouterLink}
            to="/studio"
            state={{ defaultTab: 2 }}
            className="hero-glass-panel"
            p="5"
            borderRadius="20px"
            role="group"
            _hover={{ transform: "translateY(-3px)" }}
            cursor="pointer"
          >
            <VStack align="start" spacing="3">
              <HStack justify="space-between" w="full">
                <Box p="2.5" borderRadius="xl" bg="rgba(0, 210, 211, 0.2)" color="#00D2D3" fontSize="20px">
                  <FaShieldAlt />
                </Box>
                <Box color="gray.500" _groupHover={{ color: "#00D2D3", transform: "translateX(3px)" }} transition="all 0.2s">
                  <FaArrowRight />
                </Box>
              </HStack>
              <Box>
                <Heading size="xs" color="white" fontWeight="800" mb="1">
                  Quality & Security Audit
                </Heading>
                <Text fontSize="xs" color="gray.400">
                  Audit maintainability, efficiency, security posture, and obtain an instant letter grade
                </Text>
              </Box>
            </VStack>
          </Box>
        </Grid>
      </Box>

      {/* Recent Reviews Section */}
      <Box className="hero-glass-panel" p="5" borderRadius="24px">
        <Flex justify="space-between" align="center" mb="4">
          <HStack spacing="2">
            <Heading size="sm" color="white" fontWeight="800">
              Recent AI Reviews
            </Heading>
            <Badge borderRadius="full" px="2" colorScheme="cyan">
              {recentReviews.length}
            </Badge>
          </HStack>
          <Button
            as={RouterLink}
            to="/history"
            size="xs"
            variant="ghost"
            color="#00F2FE"
            _hover={{ bg: "rgba(0, 242, 254, 0.1)" }}
            rightIcon={<FaArrowRight />}
            fontWeight="700"
          >
            View Full History
          </Button>
        </Flex>

        {loading ? (
          <Flex justify="center" py="10">
            <Spinner color="#00F2FE" />
          </Flex>
        ) : recentReviews.length === 0 ? (
          <Box py="10" textAlign="center">
            <Box color="gray.500" fontSize="36px" mb="2">
              <FaCode style={{ margin: "0 auto" }} />
            </Box>
            <Text fontSize="sm" color="gray.400" fontWeight="600">
              No reviews performed yet.
            </Text>
            <Text fontSize="xs" color="gray.500" mt="1">
              Start by converting code or running a debug scan in the studio!
            </Text>
            <Button
              as={RouterLink}
              to="/studio"
              size="sm"
              className="btn-hero-primary"
              mt="4"
              leftIcon={<FaRocket />}
            >
              Open Code Studio
            </Button>
          </Box>
        ) : (
          <Box overflowX="auto">
            <Table variant="unstyled" size="sm">
              <Thead borderBottom="1px solid rgba(255, 255, 255, 0.08)">
                <Tr>
                  <Th color="gray.400" fontSize="10px" textTransform="uppercase">Type</Th>
                  <Th color="gray.400" fontSize="10px" textTransform="uppercase">Language</Th>
                  <Th color="gray.400" fontSize="10px" textTransform="uppercase">Preview</Th>
                  <Th color="gray.400" fontSize="10px" textTransform="uppercase">Date</Th>
                  <Th color="gray.400" fontSize="10px" textTransform="uppercase" textAlign="right">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {recentReviews.map((review) => (
                  <Tr
                    key={review._id}
                    borderBottom="1px solid rgba(255, 255, 255, 0.04)"
                    _hover={{ bg: "rgba(255, 255, 255, 0.02)" }}
                  >
                    <Td>{getTypeBadge(review.type)}</Td>
                    <Td>
                      <Badge variant="outline" borderColor="rgba(255,255,255,0.15)" color="gray.300" textTransform="uppercase" fontSize="10px">
                        {review.type === "convert"
                          ? `${review.inputLanguage || "auto"} → ${review.outputLanguage}`
                          : review.language || "javascript"}
                      </Badge>
                    </Td>
                    <Td maxW="240px" isTruncated color="gray.400" fontSize="xs" fontFamily="'JetBrains Mono', monospace">
                      {review.code.slice(0, 40)}...
                    </Td>
                    <Td fontSize="xs" color="gray.400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </Td>
                    <Td textAlign="right">
                      <HStack spacing="1" justify="end">
                        <Tooltip label="View Details" placement="top">
                          <IconButton
                            aria-label="View Review"
                            icon={<FaEye />}
                            size="xs"
                            variant="ghost"
                            color="#00F2FE"
                            _hover={{ bg: "rgba(0, 242, 254, 0.15)" }}
                            onClick={() => handleOpenReview(review)}
                          />
                        </Tooltip>
                        <Tooltip label="Delete Review" placement="top">
                          <IconButton
                            aria-label="Delete Review"
                            icon={<FaTrashAlt />}
                            size="xs"
                            variant="ghost"
                            color="#FF3366"
                            _hover={{ bg: "rgba(255, 51, 102, 0.15)" }}
                            onClick={(e) => handleDeleteReview(review._id, e)}
                          />
                        </Tooltip>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </Box>

      {/* Review Detail Modal */}
      {selectedReview && (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered motionPreset="slideInBottom">
          <ModalOverlay backdropFilter="blur(16px)" bg="rgba(0,0,0,0.65)" />
          <ModalContent bg="#0D1122" border="1px solid rgba(112, 101, 240, 0.3)" borderRadius="2xl">
            <ModalHeader color="white" borderBottom="1px solid rgba(255, 255, 255, 0.08)" fontSize="sm" fontWeight="800">
              <HStack justify="space-between" pr="6">
                <HStack spacing="2">
                  {getTypeBadge(selectedReview.type)}
                  <Text>Review Details</Text>
                </HStack>
                <Text fontSize="xs" color="gray.400" fontWeight="500">
                  {new Date(selectedReview.createdAt).toLocaleString()}
                </Text>
              </HStack>
            </ModalHeader>
            <ModalCloseButton color="gray.400" />

            <ModalBody py="4">
              <VStack spacing="4" align="stretch">
                <Box>
                  <Text fontSize="xs" fontWeight="700" color="gray.400" mb="1" textTransform="uppercase">
                    Input Code:
                  </Text>
                  <Box className="hero-editor-container" maxH="200px" overflowY="auto">
                    <CodeEditor
                      value={selectedReview.code}
                      mode={selectedReview.language || "javascript"}
                      readOnly={true}
                      height="180px"
                    />
                  </Box>
                </Box>

                {selectedReview.type === "convert" && selectedReview.result?.convertedCode && (
                  <Box>
                    <Text fontSize="xs" fontWeight="700" color="#7065F0" mb="1" textTransform="uppercase">
                      Converted Result ({selectedReview.outputLanguage}):
                    </Text>
                    <Box className="hero-editor-container">
                      <CodeEditor
                        value={selectedReview.result.convertedCode}
                        mode={selectedReview.outputLanguage || "javascript"}
                        readOnly={true}
                        height="180px"
                      />
                    </Box>
                  </Box>
                )}

                {selectedReview.type === "debug" && selectedReview.result?.debugInfo && (
                  <Box>
                    <Alert
                      status={selectedReview.result.debugInfo.hasErrors ? "warning" : "success"}
                      borderRadius="lg"
                      py="2"
                    >
                      <AlertIcon />
                      <Text fontSize="xs" fontWeight="700">
                        {selectedReview.result.debugInfo.hasErrors
                          ? `Found ${selectedReview.result.debugInfo.bugs?.length || 0} issues`
                          : "Code is clean"}
                      </Text>
                    </Alert>
                    {selectedReview.result.debugInfo.fixedCode && (
                      <Box mt="2" className="hero-editor-container">
                        <CodeEditor
                          value={selectedReview.result.debugInfo.fixedCode}
                          mode={selectedReview.language || "javascript"}
                          readOnly={true}
                          height="180px"
                        />
                      </Box>
                    )}
                  </Box>
                )}

                {selectedReview.type === "codeQuality" && selectedReview.result?.qualityReport && (
                  <Box bg="rgba(255,255,255,0.03)" p="3" borderRadius="xl" border="1px solid rgba(255,255,255,0.06)">
                    <HStack justify="space-between" mb="2">
                      <Text fontSize="xs" fontWeight="700" color="#00D2D3">
                        Overall Score:
                      </Text>
                      <Badge colorScheme="cyan" fontSize="md" px="2" py="0.5">
                        {selectedReview.result.qualityReport.score}/100
                      </Badge>
                    </HStack>
                    <Text fontSize="xs" color="gray.300">
                      {selectedReview.result.qualityReport.summary}
                    </Text>
                  </Box>
                )}
              </VStack>
            </ModalBody>

            <ModalFooter borderTop="1px solid rgba(255, 255, 255, 0.08)">
              <Button
                size="sm"
                color="red.300"
                variant="ghost"
                mr="auto"
                leftIcon={<FaTrashAlt />}
                onClick={() => handleDeleteReview(selectedReview._id)}
              >
                Delete
              </Button>
              <Button size="sm" variant="ghost" color="gray.400" mr="2" onClick={onClose}>
                Close
              </Button>
              <Button
                size="sm"
                className="btn-hero-primary"
                leftIcon={<FaRocket />}
                onClick={() => handleOpenInStudio(selectedReview)}
              >
                Open in Code Studio
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default Dashboard;

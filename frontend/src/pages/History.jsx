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
  IconButton,
  Tooltip,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Grid,
  GridItem,
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
import { getMyReviewsApi, deleteReviewApi } from "../api";
import CodeEditor from "../components/CodeEditor";
import {
  FaSearch,
  FaFilter,
  FaTrashAlt,
  FaEye,
  FaRocket,
  FaHistory,
  FaCode,
  FaCalendarAlt,
  FaCopy,
  FaCheck,
} from "react-icons/fa";
import { CgArrowsExchange } from "react-icons/cg";
import { VscDebugAll } from "react-icons/vsc";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { toast } from "react-toastify";

const History = () => {
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Review Inspection Modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedReview, setSelectedReview] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await getMyReviewsApi();
      if (res.data?.reviews) {
        setReviews(res.data.reviews);
      }
    } catch (error) {
      console.error("Fetch reviews error:", error);
      toast.error("Failed to load review history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id, e) => {
    e?.stopPropagation();
    if (!window.confirm("Are you sure you want to permanently delete this review?")) return;

    try {
      await deleteReviewApi(id);
      toast.success("Review deleted successfully.");
      setReviews((prev) => prev.filter((r) => r._id !== id));
      if (selectedReview?._id === id) {
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to delete review.");
    }
  };

  const handleOpenDetail = (review) => {
    setSelectedReview(review);
    onOpen();
  };

  const handleOpenInStudio = (review) => {
    onClose();
    navigate("/studio", { state: { loadReview: review } });
  };

  const handleCopyCode = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    toast.success("Code copied!");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case "convert":
        return (
          <Badge bg="rgba(112, 101, 240, 0.25)" color="#7065F0" border="1px solid rgba(112, 101, 240, 0.4)" px="2" py="0.5" borderRadius="md" fontWeight="800">
            Convert
          </Badge>
        );
      case "debug":
        return (
          <Badge bg="rgba(255, 51, 102, 0.25)" color="#FF3366" border="1px solid rgba(255, 51, 102, 0.4)" px="2" py="0.5" borderRadius="md" fontWeight="800">
            Debug
          </Badge>
        );
      case "codeQuality":
        return (
          <Badge bg="rgba(0, 210, 211, 0.25)" color="#00D2D3" border="1px solid rgba(0, 210, 211, 0.4)" px="2" py="0.5" borderRadius="md" fontWeight="800">
            Quality
          </Badge>
        );
      default:
        return <Badge>{type}</Badge>;
    }
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesType = filterType === "all" || review.type === filterType;
    const matchesSearch =
      searchTerm === "" ||
      review.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.language?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.outputLanguage?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <Box py="2">
      {/* Header Banner */}
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
              <Box color="#00D2D3" fontSize="22px"><FaHistory /></Box>
              <Heading
                as="h1"
                fontSize={{ base: "1.4rem", md: "1.75rem" }}
                fontFamily="'Outfit', sans-serif"
                fontWeight="900"
                className="text-hero-gradient"
              >
                Analysis & Review History
              </Heading>
            </HStack>
            <Text fontSize="xs" color="gray.400" fontWeight="500">
              Your private chronological log of all AI code conversions, debugging sessions, and quality reports
            </Text>
          </VStack>

          {/* Search & Filter Controls */}
          <HStack spacing="3" w={{ base: "full", md: "auto" }}>
            <InputGroup size="sm" maxW={{ base: "full", md: "220px" }}>
              <InputLeftElement pointerEvents="none" color="gray.500">
                <FaSearch />
              </InputLeftElement>
              <Input
                placeholder="Search snippets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                bg="rgba(14, 20, 44, 0.85)"
                borderColor="rgba(112, 101, 240, 0.25)"
                _hover={{ borderColor: "#00F2FE" }}
                _focus={{ borderColor: "#00F2FE" }}
                borderRadius="xl"
                color="white"
              />
            </InputGroup>

            <Select
              size="sm"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              bg="rgba(14, 20, 44, 0.85)"
              borderColor="rgba(112, 101, 240, 0.25)"
              color="#00F2FE"
              fontWeight="700"
              borderRadius="xl"
              w="130px"
            >
              <option value="all" style={{ background: "#0D1122" }}>All Types</option>
              <option value="convert" style={{ background: "#0D1122" }}>Convert</option>
              <option value="debug" style={{ background: "#0D1122" }}>Debug</option>
              <option value="codeQuality" style={{ background: "#0D1122" }}>Quality</option>
            </Select>
          </HStack>
        </Flex>
      </Box>

      {/* Reviews List */}
      {loading ? (
        <Flex justify="center" py="16">
          <VStack spacing="3">
            <Spinner size="lg" color="#00F2FE" />
            <Text fontSize="xs" color="gray.400">Loading your history...</Text>
          </VStack>
        </Flex>
      ) : filteredReviews.length === 0 ? (
        <Box className="hero-glass-panel" py="16" textAlign="center" borderRadius="24px">
          <Box color="gray.500" fontSize="40px" mb="3">
            <FaCode style={{ margin: "0 auto" }} />
          </Box>
          <Heading size="xs" color="white" fontWeight="800" mb="1" textTransform="uppercase">
            No Analyses Found
          </Heading>
          <Text fontSize="xs" color="gray.400" maxW="320px" mx="auto">
            {searchTerm || filterType !== "all"
              ? "No reviews match your filter criteria. Try clearing the search filter."
              : "You haven't run any AI reviews yet. Open the studio to get started!"}
          </Text>
          <Button
            size="sm"
            className="btn-hero-primary"
            mt="4"
            leftIcon={<FaRocket />}
            onClick={() => navigate("/studio")}
          >
            Launch Code Studio
          </Button>
        </Box>
      ) : (
        <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap="4">
          {filteredReviews.map((review, idx) => (
            <GridItem key={review._id}>
              <Box
                as={motion.div}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.03 }}
                className="hero-glass-panel"
                p="4"
                borderRadius="20px"
                _hover={{ borderColor: "rgba(0, 242, 254, 0.4)" }}
              >
                <Flex direction="column" justify="space-between" h="full" gap="3">
                  {/* Card Header */}
                  <Flex justify="space-between" align="start">
                    <HStack spacing="2">
                      {getTypeBadge(review.type)}
                      <Badge
                        variant="outline"
                        borderColor="rgba(255,255,255,0.15)"
                        color="gray.300"
                        textTransform="uppercase"
                        fontSize="10px"
                      >
                        {review.type === "convert"
                          ? `${review.inputLanguage || "auto"} → ${review.outputLanguage}`
                          : review.language || "javascript"}
                      </Badge>
                    </HStack>

                    <HStack spacing="1.5" color="gray.500" fontSize="11px">
                      <FaCalendarAlt />
                      <Text>{new Date(review.createdAt).toLocaleDateString()}</Text>
                    </HStack>
                  </Flex>

                  {/* Code Snippet Box */}
                  <Box
                    bg="rgba(8, 11, 24, 0.9)"
                    p="2.5"
                    borderRadius="xl"
                    border="1px solid rgba(255, 255, 255, 0.06)"
                    fontFamily="'JetBrains Mono', monospace"
                    fontSize="11px"
                    color="gray.300"
                    maxH="90px"
                    overflow="hidden"
                    position="relative"
                  >
                    <pre style={{ margin: 0, overflow: "hidden", textOverflow: "ellipsis" }}>
                      {review.code}
                    </pre>
                    <Box
                      position="absolute"
                      inset="0"
                      bg="linear-gradient(to bottom, transparent 40%, rgba(8, 11, 24, 0.95) 100%)"
                      pointerEvents="none"
                    />
                  </Box>

                  {/* Card Footer Actions */}
                  <Flex justify="space-between" align="center" pt="1">
                    <Button
                      size="xs"
                      className="btn-hero-primary"
                      leftIcon={<FaEye />}
                      onClick={() => handleOpenDetail(review)}
                      fontSize="11px"
                    >
                      Inspect Result
                    </Button>

                    <HStack spacing="1.5">
                      <Button
                        size="xs"
                        variant="ghost"
                        color="#7065F0"
                        _hover={{ bg: "rgba(112, 101, 240, 0.15)" }}
                        leftIcon={<FaRocket />}
                        onClick={() => handleOpenInStudio(review)}
                        fontSize="11px"
                      >
                        Open in Studio
                      </Button>

                      <Tooltip label="Delete Review" placement="top">
                        <IconButton
                          aria-label="Delete"
                          icon={<FaTrashAlt />}
                          size="xs"
                          variant="ghost"
                          color="#FF3366"
                          _hover={{ bg: "rgba(255, 51, 102, 0.15)" }}
                          onClick={(e) => handleDelete(review._id, e)}
                        />
                      </Tooltip>
                    </HStack>
                  </Flex>
                </Flex>
              </Box>
            </GridItem>
          ))}
        </Grid>
      )}

      {/* Review Full Inspector Modal */}
      {selectedReview && (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered motionPreset="slideInBottom">
          <ModalOverlay backdropFilter="blur(18px)" bg="rgba(0,0,0,0.65)" />
          <ModalContent bg="#0D1122" border="1px solid rgba(112, 101, 240, 0.3)" borderRadius="2xl" maxH="85vh" overflowY="auto">
            <ModalHeader color="white" borderBottom="1px solid rgba(255, 255, 255, 0.08)" fontSize="sm" fontWeight="800">
              <HStack justify="space-between" pr="6">
                <HStack spacing="2">
                  {getTypeBadge(selectedReview.type)}
                  <Text>Review Archive Record</Text>
                </HStack>
                <Text fontSize="xs" color="gray.400" fontWeight="500">
                  {new Date(selectedReview.createdAt).toLocaleString()}
                </Text>
              </HStack>
            </ModalHeader>
            <ModalCloseButton color="gray.400" />

            <ModalBody py="4">
              <VStack spacing="4" align="stretch">
                {/* Original Source Code */}
                <Box>
                  <Flex justify="space-between" align="center" mb="1">
                    <Text fontSize="xs" fontWeight="700" color="gray.300" textTransform="uppercase">
                      Source Code ({selectedReview.language || "javascript"}):
                    </Text>
                    <Button
                      size="xs"
                      variant="ghost"
                      color="gray.400"
                      _hover={{ color: "white" }}
                      leftIcon={copiedCode ? <FaCheck /> : <FaCopy />}
                      onClick={() => handleCopyCode(selectedReview.code)}
                    >
                      {copiedCode ? "Copied" : "Copy"}
                    </Button>
                  </Flex>
                  <Box className="hero-editor-container">
                    <CodeEditor
                      value={selectedReview.code}
                      mode={selectedReview.language || "javascript"}
                      readOnly={true}
                      height="190px"
                    />
                  </Box>
                </Box>

                {/* Convert Output */}
                {selectedReview.type === "convert" && selectedReview.result?.convertedCode && (
                  <Box>
                    <Text fontSize="xs" fontWeight="700" color="#7065F0" mb="1" textTransform="uppercase">
                      Converted Code ({selectedReview.outputLanguage}):
                    </Text>
                    <Box className="hero-editor-container">
                      <CodeEditor
                        value={selectedReview.result.convertedCode}
                        mode={selectedReview.outputLanguage || "javascript"}
                        readOnly={true}
                        height="200px"
                      />
                    </Box>
                  </Box>
                )}

                {/* Debug Output */}
                {selectedReview.type === "debug" && selectedReview.result?.debugInfo && (
                  <Box>
                    <Alert
                      status={selectedReview.result.debugInfo.hasErrors ? "warning" : "success"}
                      borderRadius="lg"
                      py="2"
                      mb="3"
                    >
                      <AlertIcon />
                      <Text fontSize="xs" fontWeight="700">
                        {selectedReview.result.debugInfo.hasErrors
                          ? `Identified ${selectedReview.result.debugInfo.bugs?.length || 0} issues`
                          : "Code was clean"}
                      </Text>
                    </Alert>

                    {selectedReview.result.debugInfo.fixedCode && (
                      <Box mb="3">
                        <Text fontSize="xs" fontWeight="700" color="#00D2D3" mb="1" textTransform="uppercase">
                          Fixed Code:
                        </Text>
                        <Box className="hero-editor-container">
                          <CodeEditor
                            value={selectedReview.result.debugInfo.fixedCode}
                            mode={selectedReview.language || "javascript"}
                            readOnly={true}
                            height="180px"
                          />
                        </Box>
                      </Box>
                    )}

                    {selectedReview.result.debugInfo.explanation && (
                      <Box bg="rgba(18, 24, 48, 0.8)" p="3" borderRadius="xl" border="1px solid rgba(112, 101, 240, 0.2)">
                        <Text fontSize="xs" fontWeight="700" color="#FECA57" mb="1" textTransform="uppercase">
                          Explanation:
                        </Text>
                        <Text fontSize="xs" color="gray.300" whiteSpace="pre-wrap">
                          {selectedReview.result.debugInfo.explanation}
                        </Text>
                      </Box>
                    )}
                  </Box>
                )}

                {/* Quality Output */}
                {selectedReview.type === "codeQuality" && selectedReview.result?.qualityReport && (
                  <Box bg="rgba(18, 24, 48, 0.8)" p="4" borderRadius="xl" border="1px solid rgba(112, 101, 240, 0.2)">
                    <HStack justify="space-between" mb="3">
                      <Text fontSize="xs" fontWeight="800" color="#00D2D3" textTransform="uppercase">
                        Quality Scorecard
                      </Text>
                      <Badge colorScheme="cyan" fontSize="md" px="2.5" py="0.5" borderRadius="md">
                        {selectedReview.result.qualityReport.score} / 100
                      </Badge>
                    </HStack>
                    <Text fontSize="xs" color="gray.300" whiteSpace="pre-wrap">
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
                onClick={() => handleDelete(selectedReview._id)}
              >
                Delete Record
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
                Open in Studio
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default History;

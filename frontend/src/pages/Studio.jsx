import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Flex,
  Box,
  Heading,
  Select,
  Button,
  Text,
  Badge,
  CircularProgress,
  CircularProgressLabel,
  Stack,
  HStack,
  VStack,
  IconButton,
  Tooltip,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Grid,
  GridItem,
  Progress,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import CodeEditor from "../components/CodeEditor";
import { MdArrowDropDown } from "react-icons/md";
import { VscDebugAll } from "react-icons/vsc";
import { BsFillPatchCheckFill, BsCheck2Circle, BsShieldCheck } from "react-icons/bs";
import { CgArrowsExchange } from "react-icons/cg";
import {
  FaCopy,
  FaCheck,
  FaDownload,
  FaLightbulb,
  FaBolt,
  FaRocket,
  FaTrashAlt,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { codeModes } from "../constants";
import { getConvertedCode, getDebugResponse, getQualityCheck } from "../api";
import { toast } from "react-toastify";

// Preset sample snippets
const SAMPLE_SNIPPETS = {
  factorial: {
    name: "Factorial Function (JS)",
    lang: "javascript",
    code: `function calculateFactorial(n) {
  if (n < 0) return -1;
  if (n === 0) return 1;
  
  let result = 1;
  for (let i = 1; i <= n; i++) {
    result = result * i;
  }
  return result;
}`,
  },
  buggyCart: {
    name: "Buggy Cart Calculator (JS)",
    lang: "javascript",
    code: `// Buggy shopping cart processor with common bugs
function processCart(items, discountCode) {
  let total = 0;
  // Bug 1: Array out-of-bounds (<= instead of <)
  for (let i = 0; i <= items.length; i++) {
    // Bug 2: Missing null check for price/quantity
    total += items[i].price * items[i].quantity;
  }
  
  // Bug 3: Loose comparison and unvalidated discount
  if (discountCode == "VIP_10") {
    total = total - (total * 0.10);
  }
  
  return total;
}`,
  },
  pythonPipeline: {
    name: "User Filter Pipeline (Python)",
    lang: "python",
    code: `def filter_active_users(users):
    """Filter and categorize active high-scoring users"""
    active_records = []
    for user in users:
        if user.get("is_active") and user.get("score", 0) > 50:
            active_records.append({
                "id": user["id"],
                "username": user["username"].lower(),
                "tier": "gold" if user["score"] > 80 else "silver"
            })
    return active_records`,
  },
};

// Markdown renderer for explanations
const renderMarkdown = (text) => {
  if (!text) return { __html: "" };
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  html = html.replace(/^### (.*$)/gim, '<h4 style="font-size: 1.02rem; font-weight: 700; margin-top: 14px; margin-bottom: 6px; color: #00F2FE; font-family: inherit;">$1</h4>');
  html = html.replace(/^## (.*$)/gim, '<h3 style="font-size: 1.15rem; font-weight: 700; margin-top: 18px; margin-bottom: 8px; color: #FFFFFF; font-family: inherit;">$1</h3>');
  html = html.replace(/^# (.*$)/gim, '<h2 style="font-size: 1.3rem; font-weight: 800; margin-top: 20px; margin-bottom: 10px; color: #FFFFFF; font-family: inherit;">$1</h2>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: 700; color: #F8FAFC;">$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em style="font-style: italic; color: #A0AEC0;">$1</em>');
  html = html.replace(/`(.*?)`/g, '<code style="font-family: \'JetBrains Mono\', monospace; background: rgba(0, 242, 254, 0.12); color: #00F2FE; border: 1px solid rgba(0, 242, 254, 0.25); padding: 1px 6px; border-radius: 4px; font-size: 0.88em;">$1</code>');
  html = html.replace(/^\s*-\s+(.*$)/gim, '<li style="margin-left: 18px; margin-bottom: 6px; color: #CBD5E1; font-size: 0.93rem;">$1</li>');
  html = html.replace(/^\s*\*\s+(.*$)/gim, '<li style="margin-left: 18px; margin-bottom: 6px; color: #CBD5E1; font-size: 0.93rem;">$1</li>');

  html = html.split("\n").map((line) => {
    const trimmed = line.trim();
    if (!trimmed) return "";
    if (trimmed.startsWith("<h") || trimmed.startsWith("<li") || trimmed.startsWith("<ul") || trimmed.startsWith("<ol")) {
      return line;
    }
    return `<p style="margin-bottom: 10px; line-height: 1.65; color: #CBD5E1; font-size: 0.93rem;">${line}</p>`;
  }).join("\n");

  return { __html: html };
};

const Studio = ({ editorTheme = "twilight" }) => {
  const location = useLocation();

  // State
  const [code, setCode] = useState(SAMPLE_SNIPPETS.factorial.code);
  const [sourceLang, setSourceLang] = useState("javascript");
  const [targetLang, setTargetLang] = useState("typescript");
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);

  const [convertedCode, setConvertedCode] = useState("");
  const [debugResult, setDebugResult] = useState(null);
  const [qualityResult, setQualityResult] = useState(null);

  const [copiedInput, setCopiedInput] = useState(false);
  const [copiedOutput, setCopiedOutput] = useState(false);

  // Handle incoming navigation state (e.g. from Dashboard or History)
  useEffect(() => {
    if (location.state?.defaultTab !== undefined) {
      setActiveTab(location.state.defaultTab);
    }
    if (location.state?.loadReview) {
      const rev = location.state.loadReview;
      setCode(rev.code);
      if (rev.language) setSourceLang(rev.language);

      if (rev.type === "convert") {
        setActiveTab(0);
        if (rev.outputLanguage) setTargetLang(rev.outputLanguage);
        if (rev.result?.convertedCode) setConvertedCode(rev.result.convertedCode);
      } else if (rev.type === "debug") {
        setActiveTab(1);
        if (rev.result?.debugInfo) setDebugResult(rev.result.debugInfo);
      } else if (rev.type === "codeQuality") {
        setActiveTab(2);
        if (rev.result?.qualityReport) setQualityResult(rev.result.qualityReport);
      }
      toast.info(`Loaded saved ${rev.type} review`);
    }
  }, [location.state]);

  const handleCopy = (text, setCopied) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (content, filename) => {
    if (!content) return;
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("File downloaded!");
  };

  const handleLoadSnippet = (snippetKey) => {
    const snippet = SAMPLE_SNIPPETS[snippetKey];
    if (snippet) {
      setCode(snippet.code);
      setSourceLang(snippet.lang);
      toast.info(`Loaded: ${snippet.name}`);
    }
  };

  const handleClearCode = () => {
    setCode("");
    toast.info("Editor cleared");
  };

  const swapLanguages = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
    if (convertedCode) {
      setCode(convertedCode);
      setConvertedCode("");
    }
    toast.info(`Swapped: ${targetLang.toUpperCase()} ↔ ${temp.toUpperCase()}`);
  };

  // Operations
  const handleConvert = async () => {
    if (!code.trim()) {
      toast.warning("Please enter code to convert!");
      return;
    }
    setLoading(true);
    try {
      const res = await getConvertedCode(code, sourceLang, targetLang);
      if (res.status === 200) {
        setConvertedCode(res.data.convertedCode);
        toast.success("Code converted & saved to your history!");
      }
    } catch (err) {
      const errMsg = err.response?.data?.error || "Failed to convert code.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDebug = async () => {
    if (!code.trim()) {
      toast.warning("Please enter code to debug!");
      return;
    }
    setLoading(true);
    try {
      const res = await getDebugResponse(code, sourceLang);
      if (res.status === 200) {
        setDebugResult(res.data.debugInfo);
        toast.success("Debug analysis finished & saved to your history!");
      }
    } catch (err) {
      const errMsg = err.response?.data?.error || "Failed to run debugging.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleQualityCheck = async () => {
    if (!code.trim()) {
      toast.warning("Please enter code to analyze!");
      return;
    }
    setLoading(true);
    try {
      const res = await getQualityCheck(code, sourceLang);
      if (res.status === 200) {
        setQualityResult(res.data.qualityReport);
        toast.success("Code quality check complete & saved to your history!");
      }
    } catch (err) {
      const errMsg = err.response?.data?.error || "Failed to analyze code.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const getScoreDetails = (score) => {
    if (score >= 90) return { grade: "A+", hex: "#00D2D3", label: "Master Level" };
    if (score >= 80) return { grade: "A", hex: "#00F2FE", label: "Great" };
    if (score >= 70) return { grade: "B", hex: "#7065F0", label: "Solid" };
    if (score >= 50) return { grade: "C", hex: "#FECA57", label: "Needs Polish" };
    return { grade: "D", hex: "#FF3366", label: "Action Required" };
  };

  const codeLineCount = code ? code.split("\n").length : 0;
  const codeCharCount = code ? code.length : 0;

  return (
    <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap="5">
      {/* Left Column: Source Code Input Studio */}
      <GridItem
        as={motion.div}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
      >
        <Flex flexDirection="column" h="full" className="hero-glass-panel" p="0" overflow="hidden">
          {/* Window Top Bar */}
          <Box className="hero-window-header">
            <HStack spacing="3">
              <Box className="window-dots">
                <Box className="window-dot red" />
                <Box className="window-dot yellow" />
                <Box className="window-dot green" />
              </Box>
              <HStack spacing="2">
                <Text fontSize="xs" fontWeight="800" color="#A0AEC0" letterSpacing="0.05em">
                  SOURCE
                </Text>
                <Select
                  size="xs"
                  variant="filled"
                  bg="rgba(0, 242, 254, 0.08)"
                  border="1px solid rgba(0, 242, 254, 0.3)"
                  borderRadius="md"
                  w="120px"
                  color="#00F2FE"
                  fontWeight="800"
                  onChange={(e) => setSourceLang(e.target.value)}
                  value={sourceLang}
                >
                  {codeModes.map((item) => (
                    <option key={item} value={item} style={{ background: "#0D1122", color: "#F1F5F9" }}>
                      {item.toUpperCase()}
                    </option>
                  ))}
                </Select>
              </HStack>
            </HStack>

            {/* Action buttons */}
            <HStack spacing="1.5">
              <Menu>
                <MenuButton
                  as={Button}
                  size="xs"
                  variant="ghost"
                  color="gray.300"
                  _hover={{ color: "#00F2FE", bg: "rgba(0, 242, 254, 0.1)" }}
                  rightIcon={<MdArrowDropDown />}
                  fontWeight="700"
                >
                  Presets
                </MenuButton>
                <MenuList bg="#0D1122" borderColor="rgba(112, 101, 240, 0.3)" boxShadow="0 12px 35px rgba(0,0,0,0.6)">
                  <MenuItem bg="#0D1122" _hover={{ bg: "rgba(0,242,254,0.15)", color: "#00F2FE" }} onClick={() => handleLoadSnippet("factorial")}>
                    ⚡ Factorial (JS)
                  </MenuItem>
                  <MenuItem bg="#0D1122" _hover={{ bg: "rgba(255,51,102,0.15)", color: "#FF3366" }} onClick={() => handleLoadSnippet("buggyCart")}>
                    🐛 Buggy Cart (JS)
                  </MenuItem>
                  <MenuItem bg="#0D1122" _hover={{ bg: "rgba(0,210,211,0.15)", color: "#00D2D3" }} onClick={() => handleLoadSnippet("pythonPipeline")}>
                    🐍 Python Pipeline
                  </MenuItem>
                </MenuList>
              </Menu>

              <Tooltip label="Clear Editor" placement="top">
                <IconButton
                  aria-label="Clear Code"
                  icon={<FaTrashAlt />}
                  size="xs"
                  variant="ghost"
                  color="gray.400"
                  _hover={{ color: "#FF3366", bg: "rgba(255,51,102,0.15)" }}
                  onClick={handleClearCode}
                />
              </Tooltip>

              <Tooltip label="Copy Source Code" placement="top">
                <IconButton
                  aria-label="Copy input"
                  icon={copiedInput ? <FaCheck /> : <FaCopy />}
                  size="xs"
                  variant="ghost"
                  color={copiedInput ? "#00D2D3" : "gray.400"}
                  _hover={{ color: "#00F2FE", bg: "rgba(0,242,254,0.1)" }}
                  onClick={() => handleCopy(code, setCopiedInput)}
                />
              </Tooltip>
            </HStack>
          </Box>

          {/* Code Editor */}
          <Box p="3">
            <Box className="hero-editor-container">
              <CodeEditor
                value={code}
                onChange={(val) => setCode(val)}
                mode={sourceLang}
                theme={editorTheme}
                height="560px"
              />
            </Box>
          </Box>

          {/* Footer status bar */}
          <Flex
            justify="space-between"
            align="center"
            px="4"
            py="2"
            bg="rgba(14, 18, 36, 0.7)"
            borderTop="1px solid rgba(112, 101, 240, 0.12)"
          >
            <HStack spacing="3">
              <Text fontSize="11px" color="gray.500" fontWeight="600">
                Lines: <strong style={{ color: "#CBD5E1" }}>{codeLineCount}</strong>
              </Text>
              <Text fontSize="11px" color="gray.500" fontWeight="600">
                Chars: <strong style={{ color: "#CBD5E1" }}>{codeCharCount}</strong>
              </Text>
            </HStack>
            <HStack spacing="1.5">
              <Text fontSize="11px" color="#00F2FE" fontWeight="700">
                Mode: {sourceLang.toUpperCase()}
              </Text>
            </HStack>
          </Flex>
        </Flex>
      </GridItem>

      {/* Right Column: AI Intelligence Studio */}
      <GridItem
        as={motion.div}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Flex flexDirection="column" h="full" className="hero-glass-panel" p="0" overflow="hidden">
          {/* Window Header */}
          <Box className="hero-window-header" pb="2">
            <HStack spacing="3">
              <Box className="window-dots">
                <Box className="window-dot red" />
                <Box className="window-dot yellow" />
                <Box className="window-dot green" />
              </Box>
              <Text fontSize="xs" fontWeight="800" color="#A0AEC0" letterSpacing="0.05em">
                AI INTELLIGENCE STUDIO
              </Text>
            </HStack>
          </Box>

          <Box p="3">
            <Tabs isFitted variant="unstyled" index={activeTab} onChange={(index) => setActiveTab(index)}>
              {/* Segmented Tab Bar */}
              <TabList mb="4" bg="rgba(14, 18, 36, 0.85)" borderRadius="xl" p="1.5" border="1px solid rgba(112, 101, 240, 0.22)">
                <Tab
                  _selected={{
                    color: "#FFFFFF",
                    bg: "linear-gradient(135deg, #7065F0, #00F2FE)",
                    borderRadius: "lg",
                    boxShadow: "0 4px 18px rgba(0, 242, 254, 0.4)",
                    fontWeight: "800",
                  }}
                  fontWeight="700"
                  fontSize="sm"
                  borderRadius="lg"
                  transition="all 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
                  color="gray.400"
                  _hover={{ color: "#00F2FE", bg: "rgba(255, 255, 255, 0.04)" }}
                  py="2.5"
                >
                  <CgArrowsExchange style={{ marginRight: "6px", fontSize: "20px" }} />
                  Convert
                </Tab>

                <Tab
                  _selected={{
                    color: "#FFFFFF",
                    bg: "linear-gradient(135deg, #FF3366, #FECA57)",
                    borderRadius: "lg",
                    boxShadow: "0 4px 18px rgba(255, 51, 102, 0.4)",
                    fontWeight: "800",
                  }}
                  fontWeight="700"
                  fontSize="sm"
                  borderRadius="lg"
                  transition="all 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
                  color="gray.400"
                  _hover={{ color: "#FF3366", bg: "rgba(255, 255, 255, 0.04)" }}
                  py="2.5"
                >
                  <VscDebugAll style={{ marginRight: "6px", fontSize: "18px" }} />
                  Bug Hunter
                </Tab>

                <Tab
                  _selected={{
                    color: "#FFFFFF",
                    bg: "linear-gradient(135deg, #10B981, #00D2D3)",
                    borderRadius: "lg",
                    boxShadow: "0 4px 18px rgba(0, 210, 211, 0.4)",
                    fontWeight: "800",
                  }}
                  fontWeight="700"
                  fontSize="sm"
                  borderRadius="lg"
                  transition="all 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
                  color="gray.400"
                  _hover={{ color: "#00D2D3", bg: "rgba(255, 255, 255, 0.04)" }}
                  py="2.5"
                >
                  <BsFillPatchCheckFill style={{ marginRight: "6px", fontSize: "16px" }} />
                  Quality Audit
                </Tab>
              </TabList>

              <TabPanels>
                {/* 1. Convert Panel */}
                <TabPanel p="0">
                  <Flex direction="column" gap="4">
                    <Flex justify="space-between" align="center" bg="rgba(18, 24, 48, 0.8)" p="3" borderRadius="xl" border="1px solid rgba(112, 101, 240, 0.25)" flexWrap="wrap" gap="2">
                      <HStack spacing="2">
                        <Text fontSize="xs" color="gray.300" fontWeight="700">Target Language:</Text>
                        <Select
                          size="sm"
                          variant="filled"
                          bg="rgba(0, 242, 254, 0.08)"
                          border="1px solid rgba(0, 242, 254, 0.3)"
                          borderRadius="lg"
                          w="135px"
                          color="#00F2FE"
                          fontWeight="800"
                          onChange={(e) => setTargetLang(e.target.value)}
                          value={targetLang}
                        >
                          {codeModes.map((item) => (
                            <option key={item} value={item} style={{ background: "#0D1122", color: "#F1F5F9" }}>
                              {item.toUpperCase()}
                            </option>
                          ))}
                        </Select>

                        <Tooltip label="Swap Source & Target Languages" placement="top">
                          <IconButton
                            aria-label="Swap Languages"
                            icon={<CgArrowsExchange />}
                            size="sm"
                            variant="ghost"
                            color="#00F2FE"
                            _hover={{ bg: "rgba(0, 242, 254, 0.15)" }}
                            onClick={swapLanguages}
                          />
                        </Tooltip>
                      </HStack>

                      <Button
                        as={motion.button}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        size="sm"
                        className="btn-hero-convert"
                        onClick={handleConvert}
                        isLoading={loading && activeTab === 0}
                        leftIcon={<FaRocket />}
                        px="5"
                      >
                        Convert Code
                      </Button>
                    </Flex>

                    {loading && activeTab === 0 ? (
                      <VStack py="24" spacing="4" as={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <HStack spacing="3">
                          <Box className="hero-loading-dot" />
                          <Box className="hero-loading-dot" />
                          <Box className="hero-loading-dot" />
                        </HStack>
                        <Text color="#CBD5E1" fontSize="sm" fontWeight="700">
                          Translating {sourceLang.toUpperCase()} into {targetLang.toUpperCase()}...
                        </Text>
                      </VStack>
                    ) : convertedCode ? (
                      <Flex direction="column" gap="3">
                        <Flex justify="space-between" align="center" px="1">
                          <Badge px="3" py="1" borderRadius="full" fontSize="xs" fontWeight="800" bg="rgba(0, 242, 254, 0.15)" color="#00F2FE" border="1px solid rgba(0, 242, 254, 0.35)">
                            ✓ Converted to {targetLang.toUpperCase()}
                          </Badge>
                          <HStack spacing="2">
                            <Button size="xs" leftIcon={copiedOutput ? <FaCheck /> : <FaCopy />} colorScheme={copiedOutput ? "cyan" : "gray"} variant="outline" onClick={() => handleCopy(convertedCode, setCopiedOutput)}>
                              {copiedOutput ? "Copied" : "Copy"}
                            </Button>
                            <Button size="xs" leftIcon={<FaDownload />} variant="outline" colorScheme="purple" onClick={() => handleDownload(convertedCode, `converted.${targetLang}`)}>
                              Download
                            </Button>
                          </HStack>
                        </Flex>

                        <Box className="hero-editor-container">
                          <CodeEditor
                            value={convertedCode}
                            mode={targetLang}
                            theme={editorTheme}
                            readOnly={true}
                            height="460px"
                          />
                        </Box>
                      </Flex>
                    ) : (
                      <Box className="hero-glass-panel" p="10" textAlign="center" borderRadius="18px">
                        <Box as={motion.div} animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }} color="#00F2FE" fontSize="44px" mb="3" display="inline-block">
                          <CgArrowsExchange />
                        </Box>
                        <Heading size="xs" color="#F1F5F9" mb="1" fontWeight="800" textTransform="uppercase" letterSpacing="0.05em">
                          Ready to Convert
                        </Heading>
                        <Text color="gray.400" fontSize="xs" maxW="300px" mx="auto">
                          Choose target language and click <strong style={{ color: "#00F2FE" }}>Convert Code</strong>.
                        </Text>
                      </Box>
                    )}
                  </Flex>
                </TabPanel>

                {/* 2. Debug Panel */}
                <TabPanel p="0">
                  <Flex direction="column" gap="4">
                    <Flex justify="space-between" align="center" bg="rgba(255, 51, 102, 0.08)" p="3" borderRadius="xl" border="1px solid rgba(255, 51, 102, 0.25)" flexWrap="wrap" gap="2">
                      <HStack spacing="2">
                        <Box color="#FF3366" fontSize="16px"><FaBolt /></Box>
                        <Text fontSize="xs" color="gray.300" fontWeight="700">
                          Automated Bug Detection & Patching
                        </Text>
                      </HStack>
                      <Button
                        as={motion.button}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        size="sm"
                        className="btn-hero-debug"
                        onClick={handleDebug}
                        isLoading={loading && activeTab === 1}
                        leftIcon={<FaBolt />}
                        px="5"
                      >
                        Debug Code
                      </Button>
                    </Flex>

                    {loading && activeTab === 1 ? (
                      <VStack py="24" spacing="4" as={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <HStack spacing="3">
                          <Box className="hero-loading-dot" style={{ background: "#FF3366" }} />
                          <Box className="hero-loading-dot" style={{ background: "#FECA57" }} />
                          <Box className="hero-loading-dot" style={{ background: "#FF3366" }} />
                        </HStack>
                        <Text color="#CBD5E1" fontSize="sm" fontWeight="700">
                          Scanning code structure and detecting issues...
                        </Text>
                      </VStack>
                    ) : debugResult ? (
                      <Flex direction="column" gap="4" maxH="550px" overflowY="auto" pr="1">
                        <Box
                          p="4"
                          borderRadius="xl"
                          bg={debugResult.hasErrors ? "rgba(254, 202, 87, 0.12)" : "rgba(0, 210, 211, 0.12)"}
                          border="1px solid"
                          borderColor={debugResult.hasErrors ? "rgba(254, 202, 87, 0.4)" : "rgba(0, 210, 211, 0.4)"}
                          boxShadow={debugResult.hasErrors ? "0 4px 20px rgba(254, 202, 87, 0.08)" : "0 4px 20px rgba(0, 210, 211, 0.08)"}
                        >
                          <Flex align="center" gap="3.5">
                            <Box
                              flexShrink={0}
                              w="36px"
                              h="36px"
                              borderRadius="full"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              bg={debugResult.hasErrors ? "rgba(254, 202, 87, 0.25)" : "rgba(0, 210, 211, 0.25)"}
                              color={debugResult.hasErrors ? "#FECA57" : "#00D2D3"}
                              fontSize="16px"
                            >
                              {debugResult.hasErrors ? <FaBolt /> : <FaCheck />}
                            </Box>
                            <Box>
                              <Text fontSize="sm" fontWeight="800" color={debugResult.hasErrors ? "#FECA57" : "#00D2D3"}>
                                {debugResult.hasErrors ? `Found ${debugResult.bugs.length} Issues in Code` : "No Major Issues Found! 🎉"}
                              </Text>
                              <Text fontSize="xs" color="#CBD5E1" fontWeight="500" mt="0.5" lineHeight="1.5">
                                {debugResult.hasErrors ? "Inspect the detected bugs and the suggested fix below." : "Your code logic looks sound! No syntax errors or logical bugs detected."}
                              </Text>
                            </Box>
                          </Flex>
                        </Box>

                        {debugResult.hasErrors && debugResult.bugs.length > 0 && (
                          <VStack align="stretch" spacing="2.5">
                            <Text fontSize="xs" fontWeight="800" letterSpacing="0.06em" textTransform="uppercase" color="#FF3366">
                              ISSUES LIST:
                            </Text>
                            {debugResult.bugs.map((bug, index) => (
                              <Box key={index} className="hero-bug-card">
                                <Flex justify="space-between" align="start" mb="1">
                                  <HStack spacing="2">
                                    <Badge fontSize="10px" fontWeight="800" px="2" py="0.5" borderRadius="md" bg={bug.severity === "High" ? "rgba(255, 51, 102, 0.25)" : bug.severity === "Medium" ? "rgba(254, 202, 87, 0.25)" : "rgba(0, 242, 254, 0.25)"} color={bug.severity === "High" ? "#FF3366" : bug.severity === "Medium" ? "#FECA57" : "#00F2FE"} border="1px solid" borderColor={bug.severity === "High" ? "rgba(255, 51, 102, 0.45)" : bug.severity === "Medium" ? "rgba(254, 202, 87, 0.45)" : "rgba(0, 242, 254, 0.45)"}>
                                      {bug.severity ? bug.severity.toUpperCase() : "BUG"}
                                    </Badge>
                                    <Text fontSize="xs" color="gray.400" fontWeight="700">
                                      {bug.line ? `Line ${bug.line}` : "Logical"}
                                    </Text>
                                  </HStack>
                                </Flex>
                                <Text fontSize="sm" color="#F1F5F9" fontWeight="600" mt="1">
                                  {bug.description}
                                </Text>
                              </Box>
                            ))}
                          </VStack>
                        )}

                        {debugResult.fixedCode && (
                          <Flex direction="column" gap="2" mt="2">
                            <Flex justify="space-between" align="center">
                              <Badge px="2.5" py="0.5" borderRadius="md" bg="rgba(0, 210, 211, 0.15)" color="#00D2D3" border="1px solid rgba(0, 210, 211, 0.35)" fontWeight="800">
                                Fixed Code Solution
                              </Badge>
                              <Button size="xs" leftIcon={copiedOutput ? <FaCheck /> : <FaCopy />} colorScheme={copiedOutput ? "green" : "gray"} variant="outline" onClick={() => handleCopy(debugResult.fixedCode, setCopiedOutput)}>
                                {copiedOutput ? "Copied" : "Copy Solution"}
                              </Button>
                            </Flex>
                            <Box className="hero-editor-container">
                              <CodeEditor
                                value={debugResult.fixedCode}
                                mode={sourceLang}
                                theme={editorTheme}
                                readOnly={true}
                                height="280px"
                              />
                            </Box>
                          </Flex>
                        )}

                        {debugResult.explanation && (
                          <Box bg="rgba(18, 24, 48, 0.8)" p="4" borderRadius="xl" border="1px solid rgba(112, 101, 240, 0.2)">
                            <HStack spacing="2" mb="2">
                              <Box color="#FECA57"><FaLightbulb /></Box>
                              <Heading size="xs" textTransform="uppercase" color="#FECA57" letterSpacing="wider">
                                Debugging Explanation
                              </Heading>
                            </HStack>
                            <Box className="md-content" dangerouslySetInnerHTML={renderMarkdown(debugResult.explanation)} />
                          </Box>
                        )}
                      </Flex>
                    ) : (
                      <Box className="hero-glass-panel" p="10" textAlign="center" borderRadius="18px">
                        <Box as={motion.div} animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 0.3 }} color="#FF3366" fontSize="44px" mb="3" display="inline-block">
                          <VscDebugAll />
                        </Box>
                        <Heading size="xs" color="#F1F5F9" mb="1" fontWeight="800" textTransform="uppercase" letterSpacing="0.05em">
                          Ready to Debug
                        </Heading>
                        <Text color="gray.400" fontSize="xs" maxW="300px" mx="auto">
                          Click <strong style={{ color: "#FF3366" }}>Debug Code</strong> to scan for errors.
                        </Text>
                      </Box>
                    )}
                  </Flex>
                </TabPanel>

                {/* 3. Quality Panel */}
                <TabPanel p="0">
                  <Flex direction="column" gap="4">
                    <Flex justify="space-between" align="center" bg="rgba(0, 210, 211, 0.08)" p="3" borderRadius="xl" border="1px solid rgba(0, 210, 211, 0.25)" flexWrap="wrap" gap="2">
                      <HStack spacing="2">
                        <Box color="#00D2D3" fontSize="16px"><BsShieldCheck /></Box>
                        <Text fontSize="xs" color="gray.300" fontWeight="700">
                          Performance & Best Practice Audit
                        </Text>
                      </HStack>
                      <Button
                        as={motion.button}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        size="sm"
                        className="btn-hero-quality"
                        onClick={handleQualityCheck}
                        isLoading={loading && activeTab === 2}
                        leftIcon={<HiSparkles />}
                        px="5"
                      >
                        Audit Quality
                      </Button>
                    </Flex>

                    {loading && activeTab === 2 ? (
                      <VStack py="24" spacing="4" as={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <HStack spacing="3">
                          <Box className="hero-loading-dot" style={{ background: "#10B981" }} />
                          <Box className="hero-loading-dot" style={{ background: "#00D2D3" }} />
                          <Box className="hero-loading-dot" style={{ background: "#7065F0" }} />
                        </HStack>
                        <Text color="#CBD5E1" fontSize="sm" fontWeight="700">
                          Analyzing code quality, performance & structure...
                        </Text>
                      </VStack>
                    ) : qualityResult ? (
                      <Flex direction="column" gap="4" maxH="480px" overflowY="auto" pr="1">
                        {(() => {
                          const scoreInfo = getScoreDetails(qualityResult.score);
                          return (
                            <Grid templateColumns={{ base: "1fr", md: "1fr 2fr" }} gap="4" bg="rgba(18, 24, 48, 0.85)" p="4" borderRadius="xl" border="1px solid rgba(112, 101, 240, 0.25)">
                              <GridItem display="flex" flexDirection="column" alignItems="center" justifyContent="center" borderRight={{ md: "1px solid rgba(112, 101, 240, 0.2)" }} py="2">
                                <Box position="relative" display="inline-flex" alignItems="center" justifyContent="center">
                                  <CircularProgress value={qualityResult.score} color={scoreInfo.hex} size="105px" thickness="8px" trackColor="rgba(255,255,255,0.06)">
                                    <CircularProgressLabel color="white" fontWeight="900" fontSize="2xl">
                                      {qualityResult.score}
                                    </CircularProgressLabel>
                                  </CircularProgress>
                                </Box>
                                <HStack spacing="1.5" mt="2">
                                  <Badge px="2" py="0.5" borderRadius="full" fontSize="xs" fontWeight="900" bg={`${scoreInfo.hex}22`} color={scoreInfo.hex} border={`1px solid ${scoreInfo.hex}44`}>
                                    GRADE {scoreInfo.grade}
                                  </Badge>
                                  <Text fontSize="xs" color="gray.300" fontWeight="700">
                                    {scoreInfo.label}
                                  </Text>
                                </HStack>
                              </GridItem>

                              <GridItem pl={{ md: "2" }}>
                                <Heading size="xs" color="#00D2D3" mb="3" textTransform="uppercase" letterSpacing="0.06em">
                                  Category Breakdown
                                </Heading>
                                <Stack spacing="3">
                                  {qualityResult.categories && Object.entries(qualityResult.categories).map(([key, value]) => {
                                    const catScore = value.score;
                                    const catColor = catScore >= 8 ? "#00D2D3" : catScore >= 5 ? "#FECA57" : "#FF3366";
                                    return (
                                      <Box key={key}>
                                        <Flex justify="space-between" align="center" mb="1">
                                          <Text fontSize="xs" textTransform="capitalize" fontWeight="700" color="#E2E8F0">
                                            {key === "bestPractices" ? "Best Practices" : key}
                                          </Text>
                                          <Badge size="xs" px="2" borderRadius="md" fontWeight="800" bg={`${catColor}22`} color={catColor}>
                                            {value.score}/10
                                          </Badge>
                                        </Flex>
                                        <Progress value={value.score * 10} size="xs" borderRadius="full" bg="rgba(255,255,255,0.08)" sx={{ "& > div": { backgroundColor: catColor } }} />
                                        <Text fontSize="10px" color="gray.400" mt="1">{value.feedback}</Text>
                                      </Box>
                                    );
                                  })}
                                </Stack>
                              </GridItem>
                            </Grid>
                          );
                        })()}

                        {qualityResult.improvements && qualityResult.improvements.length > 0 && (
                          <VStack align="stretch" spacing="2">
                            <Text fontSize="xs" fontWeight="800" textTransform="uppercase" color="#00D2D3" letterSpacing="0.06em">
                              RECOMMENDATIONS:
                            </Text>
                            {qualityResult.improvements.map((improvement, index) => (
                              <HStack key={index} className="hero-improvement-card" align="start">
                                <Box color="#00D2D3" flexShrink={0} mt="0.5"><BsCheck2Circle /></Box>
                                <Text fontSize="sm" color="#F1F5F9" fontWeight="600">{improvement}</Text>
                              </HStack>
                            ))}
                          </VStack>
                        )}

                        {qualityResult.summary && (
                          <Box bg="rgba(18, 24, 48, 0.8)" p="4" borderRadius="xl" border="1px solid rgba(112, 101, 240, 0.2)">
                            <HStack spacing="2" mb="2">
                              <Box color="#00D2D3"><HiSparkles /></Box>
                              <Heading size="xs" textTransform="uppercase" color="#00D2D3" letterSpacing="wider">
                                Executive Summary
                              </Heading>
                            </HStack>
                            <Box className="md-content" dangerouslySetInnerHTML={renderMarkdown(qualityResult.summary)} />
                          </Box>
                        )}
                      </Flex>
                    ) : (
                      <Box className="hero-glass-panel" p="10" textAlign="center" borderRadius="18px">
                        <Box as={motion.div} animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 0.5 }} color="#00D2D3" fontSize="44px" mb="3" display="inline-block">
                          <BsFillPatchCheckFill />
                        </Box>
                        <Heading size="xs" color="#F1F5F9" mb="1" fontWeight="800" textTransform="uppercase" letterSpacing="0.05em">
                          Ready for Quality Audit
                        </Heading>
                        <Text color="gray.400" fontSize="xs" maxW="300px" mx="auto">
                          Click <strong style={{ color: "#00D2D3" }}>Audit Quality</strong> to generate a report.
                        </Text>
                      </Box>
                    )}
                  </Flex>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Flex>
      </GridItem>
    </Grid>
  );
};

export default Studio;

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Flex, VStack, Box, Text } from "@chakra-ui/react";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Flex minH="70vh" justify="center" align="center">
        <VStack spacing="4">
          <Box className="loading-dots-container">
            <Box className="hero-loading-dot" />
            <Box className="hero-loading-dot" />
            <Box className="hero-loading-dot" />
          </Box>
          <Text fontSize="sm" color="#00F2FE" fontWeight="700" letterSpacing="0.04em">
            AUTHENTICATING SESSION...
          </Text>
        </VStack>
      </Flex>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;

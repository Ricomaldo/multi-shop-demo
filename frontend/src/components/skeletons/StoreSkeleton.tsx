import { Box, SimpleGrid, Skeleton, SkeletonText } from "@chakra-ui/react";

export function StoreSkeleton() {
  return (
    <Box p={6}>
      {/* Header skeleton */}
      <Skeleton height="80px" mb={6} borderRadius="md" />

      {/* Title skeleton */}
      <Box textAlign="center" mb={8}>
        <Skeleton height="40px" width="300px" mx="auto" mb={4} />
        <SkeletonText noOfLines={1} width="200px" mx="auto" />
      </Box>

      {/* Content skeleton */}
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Box key={i}>
            <Skeleton height="200px" mb={4} borderRadius="md" />
            <SkeletonText noOfLines={2} />
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}

export function StoreHeaderSkeleton() {
  return (
    <Box>
      <Skeleton height="60px" mb={4} />
      <Skeleton height="40px" width="60%" />
    </Box>
  );
}

export function ProductCardSkeleton() {
  return (
    <Box>
      <Skeleton height="200px" mb={4} borderRadius="md" />
      <Skeleton height="20px" mb={2} />
      <Skeleton height="16px" width="60%" mb={2} />
      <Skeleton height="24px" width="40%" />
    </Box>
  );
}

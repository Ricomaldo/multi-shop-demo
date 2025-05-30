import { Badge, Box, Tooltip } from "@chakra-ui/react";
import type { OpeningHours } from "../../../../shared/types";
import { useOpeningStatus } from "../../hooks/useOpeningStatus";

interface OpeningBadgeProps {
  openingHours?: OpeningHours | string;
  size?: "sm" | "md" | "lg";
}

export default function OpeningBadge({
  openingHours,
  size = "md",
}: OpeningBadgeProps) {
  const { isOpen, nextOpeningTime } = useOpeningStatus(openingHours);

  const sizeStyles = {
    sm: { px: 2, py: 1, fontSize: "xs" },
    md: { px: 3, py: 1, fontSize: "sm" },
    lg: { px: 4, py: 2, fontSize: "md" },
  };

  return (
    <Tooltip
      label={
        !isOpen && nextOpeningTime
          ? `Prochaine ouverture : ${nextOpeningTime}`
          : undefined
      }
      hasArrow
    >
      <Box display="inline-block">
        <Badge
          colorScheme={isOpen ? "green" : "red"}
          variant="solid"
          borderRadius="full"
          {...sizeStyles[size]}
        >
          {isOpen ? "Ouvert maintenant" : "Fermé"}
        </Badge>
      </Box>
    </Tooltip>
  );
}

import React from 'react';
import { Box, Heading, Text, Flex, Icon } from '@chakra-ui/react';
import { BsCloudRain, BsSun, BsCloud } from 'react-icons/bs';
import {
  WiDayCloudyHigh,
  WiDayFog,
  WiDayRain,
  WiDayThunderstorm,
} from 'react-icons/wi';

// Basic weather code mapping. Add or modify as needed.
const weatherMap: Record<
  number,
  { label: string; IconComponent: React.ElementType }
> = {
  61: { label: 'Rain', IconComponent: BsCloudRain },
  0: { label: 'Clear sky', IconComponent: BsSun },
  2: { label: 'Partly Cloudy', IconComponent: BsCloud },
  3: { label: 'Partly Cloudy with Some Sun', IconComponent: WiDayCloudyHigh },
  45: { label: 'Fog', IconComponent: WiDayFog },
  51: { label: 'Light Drizzle', IconComponent: BsCloudRain },
  53: { label: 'Moderate Drizzle', IconComponent: BsCloudRain },
  55: { label: 'Dense Drizzle', IconComponent: BsCloudRain },
  66: { label: 'Light Freezing Drizzle', IconComponent: BsCloudRain },
  67: { label: 'Heavy Freezing Drizzle', IconComponent: BsCloudRain },
  80: { label: 'Light Rain', IconComponent: WiDayRain },
  81: { label: 'Moderate Rain', IconComponent: WiDayRain },
  82: { label: 'Heavy Rain', IconComponent: WiDayRain },
  95: { label: 'Thunderstorm', IconComponent: WiDayThunderstorm },
  96: {
    label: 'Thunderstorm with Light Hail',
    IconComponent: WiDayThunderstorm,
  },
  99: {
    label: 'Thunderstorm with Heavy Hail',
    IconComponent: WiDayThunderstorm,
  },
  // Add more codes as needed
};

export interface WeatherProps {
  temperature: number;
  weathercode: number;
  relativehumidity: number;
  city: string;
}

export interface WeatherResult {
  temperature: number;
  weathercode: number;
  relativehumidity: number;
  city: string;
}

export const WeatherCard = ({
  temperature,
  weathercode,
  relativehumidity,
  city,
}: WeatherProps) => {
  // Get weather description and icon from the map
  const weatherInfo = weatherMap[weathercode];
  const weatherLabel = weatherInfo ? weatherInfo.label : 'Unknown';
  const WeatherIcon = weatherInfo ? weatherInfo.IconComponent : BsCloud;

  return (
    <Box
      w="100%"
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="md"
      p={5}
      bg="white"
      my={4}
    >
      <Heading size="md" mb={2}>
        Weather in {city}
      </Heading>
      <Flex align="center" mb={2}>
        <Icon as={WeatherIcon} boxSize={6} mr={2} />
        <Text fontSize="lg" fontWeight="bold">
          {weatherLabel}
        </Text>
      </Flex>
      <Text fontSize="md">Temperature: {temperature.toFixed(1)}°C</Text>
      <Text fontSize="md">Humidity: {relativehumidity}%</Text>
    </Box>
  );
};

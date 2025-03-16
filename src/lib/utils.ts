import { NextResponse } from 'next/server';

export const addOllamaLogging = async () => {
  console.log('Using local Ollama model. Ensuring connection...');
  try {
    // Optional: Add a quick check to see if Ollama is accessible
    const checkResponse = await fetch('http://localhost:11434/api/version', {
      method: 'GET',
    }).then((res) => res.json());
    console.log('Ollama server version:', checkResponse.version);
  } catch (error) {
    console.error('Error connecting to Ollama server:', error);
    return NextResponse.json(
      { error: 'Failed to connect to local Ollama server. Is it running?' },
      { status: 503 }
    );
  }
};

export const logUsage = ({
  promptTokens,
  completionTokens,
  totalTokens,
}: {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}) => {
  process.stdout.write('\n\n');
  console.log(
    'promptTokens:',
    promptTokens,
    ' - completionTokens:',
    completionTokens,
    ' - totalTokens:',
    totalTokens
  );
};

/**
 * Format a date to a time string based on options
 */
export const formatTime = (
  date: Date,
  showSeconds = true,
  use24Hour = false
): string => {
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: !use24Hour,
  };

  if (showSeconds) {
    options.second = '2-digit';
  }

  return date.toLocaleTimeString(undefined, options);
};

/**
 * Format a date in DD-MM-YYYY format
 */
export const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

/**
 * Get a readable abbreviation from an IANA timezone string
 */
export const getTimezoneAbbr = (timezone?: string): string => {
  if (!timezone) return '';
  // Convert IANA timezone to a more readable format
  return timezone.split('/').pop()?.replace(/_/g, ' ') || timezone;
};

/**
 * Parse a date string to DD-MM-YYYY format
 */
export const parseDateString = (
  dateString: string,
  fallbackDate: string
): string => {
  try {
    // Check if we already have a properly formatted date
    if (dateString.includes('-') && !dateString.includes('NaN')) {
      return dateString.split(', ')[0].trim();
    }

    // Parse the date part
    const datePart = dateString.split(',')[0].trim();

    // Check if this is a date we can parse
    if (datePart === 'Invalid Date' || datePart.includes('NaN')) {
      return fallbackDate;
    }

    // Handle common date formats
    let day, month, year;

    // Try to extract values based on various formats
    const dateRegex = /(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4}|\d{2})/;
    const match = datePart.match(dateRegex);

    if (match) {
      // Date matches a numeric pattern, determine format by context
      const firstNumber = parseInt(match[1], 10);

      // Assume MM/DD/YYYY format from US-based API
      if (firstNumber <= 12) {
        month = match[1].padStart(2, '0');
        day = match[2].padStart(2, '0');
      } else {
        // Likely DD/MM/YYYY format
        day = match[1].padStart(2, '0');
        month = match[2].padStart(2, '0');
      }
      year = match[3].length === 2 ? `20${match[3]}` : match[3];
    } else {
      // Handle text-based month format (e.g., "Jan 12, 2023")
      const monthNames = [
        'jan',
        'feb',
        'mar',
        'apr',
        'may',
        'jun',
        'jul',
        'aug',
        'sep',
        'oct',
        'nov',
        'dec',
      ];
      const textParts = datePart.toLowerCase().replace(',', '').split(' ');

      for (let i = 0; i < textParts.length; i++) {
        const monthIndex = monthNames.findIndex((m) =>
          textParts[i].startsWith(m)
        );
        if (monthIndex !== -1) {
          month = (monthIndex + 1).toString().padStart(2, '0');

          // Look for a number that could be the day
          const dayPart = textParts.find((p) => /^\d{1,2}$/.test(p));
          day = dayPart
            ? parseInt(dayPart, 10).toString().padStart(2, '0')
            : '01';

          // Look for a 4-digit year
          const yearPart = textParts.find((p) => /^\d{4}$/.test(p));
          year = yearPart || new Date().getFullYear().toString();

          break;
        }
      }
    }

    // If we have all parts, format as DD-MM-YYYY
    if (day && month && year) {
      return `${day}-${month}-${year}`;
    }

    // If we couldn't parse it, return the fallback
    return fallbackDate;
  } catch (e) {
    console.error('Error formatting date:', e);
    return fallbackDate;
  }
};

/**
 * Create a fallback time data object using browser's built-in timezone conversion
 */
export const createFallbackTimeData = (
  timezone: string,
  showSeconds = true,
  use24Hour = false
): {
  currentTime: string;
  timezone: string;
  timestamp: number;
} => {
  const now = new Date();
  try {
    // Create date with correct timezone info
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: showSeconds ? '2-digit' : undefined,
      hour12: !use24Hour,
    });

    const parts = formatter.formatToParts(now);
    const dateTimeObj = parts.reduce(
      (acc, part) => {
        if (part.type !== 'literal') {
          acc[part.type] = part.value;
        }
        return acc;
      },
      {} as Record<string, string>
    );

    // Format in DD-MM-YYYY
    const day = dateTimeObj.day.padStart(2, '0');
    const month = dateTimeObj.month.padStart(2, '0');
    const year = dateTimeObj.year;
    const dateFormatted = `${day}-${month}-${year}`;

    // Create time string
    const hour = dateTimeObj.hour;
    const minute = dateTimeObj.minute;
    const second = dateTimeObj.second || '00';
    const dayPeriod = dateTimeObj.dayPeriod ? ` ${dateTimeObj.dayPeriod}` : '';
    const timeFormatted = `${hour}:${minute}${showSeconds ? `:${second}` : ''}${dayPeriod}`;

    return {
      currentTime: `${dateFormatted}, ${timeFormatted}`,
      timezone: timezone,
      timestamp: now.getTime(),
    };
  } catch (e) {
    console.error('Fallback timezone conversion failed:', e);
    // Return a basic object with current time as fallback
    return {
      currentTime: `${formatDate(now)}, ${formatTime(now, showSeconds, use24Hour)}`,
      timezone: timezone,
      timestamp: now.getTime(),
    };
  }
};

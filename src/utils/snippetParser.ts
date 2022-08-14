import fs from 'fs';
import lineByLine from 'n-readlines';

function getFileExtension(path: string) {
  return path.split('.').pop();
}

// This function will use the same start and end markers for now.
// In the future, we can update this function to support different markets.
function getLanguageStartEndMarkers() {
  return { start: '[start]', end: '[end]' };
}

function getNumWhitespaceChars(codeBlock: string) {
  // Number of minimum whitespace characters in a code block
  // (we remove this indent to left align the code block)
  let minWhitespaceChars: number | undefined;
  const lines = codeBlock.split('\n');

  lines.forEach((line: string) => {
    const beginningWhitespaceChars = line.search(/\S/);

    // Ignore lines with no whitespace at the beginning
    if (beginningWhitespaceChars === -1) {
      return;
    }

    // Set the minimum whitespace at the beginning of a line
    if (minWhitespaceChars === undefined) {
      minWhitespaceChars = beginningWhitespaceChars;
    } else {
      minWhitespaceChars = Math.min(
        minWhitespaceChars,
        beginningWhitespaceChars
      );
    }
  });

  if (minWhitespaceChars === undefined) {
    minWhitespaceChars = 0;
  }

  return minWhitespaceChars;
}

function removeBeginningWhitespace(codeBlock: string) {
  let editedCodeBlock = '';

  const lines = codeBlock.split('\n');

  const numWhitespaceChars = getNumWhitespaceChars(codeBlock);

  lines.forEach((line: string) => {
    editedCodeBlock += line.slice(numWhitespaceChars) + '\n';
  });

  return editedCodeBlock;
}

export function getCodeBlock(path: string) {
  let source = '';

  const ext = getFileExtension(path);
  if (ext) {
    const { start: startMarker, end: endMarker } = getLanguageStartEndMarkers();

    if (startMarker && endMarker) {
      const liner = new lineByLine(path);
      let isRecording = false;
      let line;

      while ((line = liner.next())) {
        if (line.indexOf(endMarker) > -1) {
          isRecording = false;
        }

        if (isRecording) {
          source += line + '\n';
        }

        if (line.indexOf(startMarker) > -1) {
          isRecording = true;
        }
      }
    }
  }

  if (source.length > 0) {
    source = removeBeginningWhitespace(source);
  }

  // If there is no source, then, the file did not have any start and end markers.
  // We should return the full file contents by default
  if (source.length === 0) {
    source = fs.readFileSync(path, 'utf8');
  }

  return source;
}

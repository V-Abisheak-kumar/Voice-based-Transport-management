import { Mic, MicOff } from 'lucide-react';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { useEffect } from 'react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  placeholder?: string;
}

export function VoiceInput({ onTranscript, placeholder = 'Click the mic to speak' }: VoiceInputProps) {
  const { isListening, transcript, isSupported, startListening, stopListening } = useVoiceRecognition();

  useEffect(() => {
    if (transcript) {
      onTranscript(transcript);
    }
  }, [transcript, onTranscript]);

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
        <p className="text-yellow-800">Voice recognition is not supported in your browser.</p>
        <p className="text-sm text-yellow-600 mt-1">Please use Chrome, Edge, or Safari.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={isListening ? stopListening : startListening}
        className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
          isListening
            ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-lg shadow-red-500/50'
            : 'bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-xl'
        }`}
      >
        {isListening ? (
          <MicOff className="w-10 h-10 text-white" />
        ) : (
          <Mic className="w-10 h-10 text-white" />
        )}
      </button>

      <div className="text-center">
        {isListening ? (
          <p className="text-sm font-medium text-gray-700 animate-pulse">Listening...</p>
        ) : (
          <p className="text-sm text-gray-500">{placeholder}</p>
        )}
      </div>

      {transcript && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 max-w-md w-full">
          <p className="text-sm text-gray-500 mb-1">You said:</p>
          <p className="text-gray-900 font-medium">{transcript}</p>
        </div>
      )}
    </div>
  );
}

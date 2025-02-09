'use client';

import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUploadCloud, FiFile, FiX, FiTrash2 } from 'react-icons/fi';
import { toast } from '@/components/ui/use-toast';
import { toBlobURL } from '@ffmpeg/util';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const formats = {
  image: ['webp', 'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'avif', 'heic'],
  video: ['mp4', 'webm', 'mov', 'avi', 'mkv', 'flv', '3gp', 'wmv'],
  audio: ['mp3', 'wav', 'ogg', 'aac', 'm4a', 'flac', 'wma', 'opus']
} as const;

type FileType = keyof typeof formats;

export default function Dropzone() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [converting, setConverting] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [ffmpeg, setFFmpeg] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);

  // Initialize FFmpeg on component mount
  useEffect(() => {
    const initFFmpeg = async () => {
      try {
        const { FFmpeg } = await import('@ffmpeg/ffmpeg');
        const instance = new FFmpeg();
        setFFmpeg(instance);
      } catch (error) {
        console.error('Error initializing FFmpeg:', error);
        toast({
          title: "Error",
          description: "Failed to initialize conversion tools. Please try again.",
          variant: "destructive",
          duration: 3000,
        });
      }
    };

    if (typeof window !== 'undefined') {
      initFFmpeg();
    }
  }, []);

  const load = async () => {
    if (!ffmpeg) return;
    
    try {
      setLoading(true);
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      setLoaded(true);
    } catch (error) {
      console.error('Error loading FFmpeg:', error);
      toast({
        title: "Error",
        description: "Failed to load conversion tools. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const getFileType = (file: File): FileType | null => {
    const type = file.type.split('/')[0];
    if (type in formats) {
      return type as FileType;
    }
    return null;
  };

  const getOutputFileName = (file: File, format: string) => {
    const baseName = file.name.substring(0, file.name.lastIndexOf('.'));
    return `${baseName}.${format}`;
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length) {
      setFiles(acceptedFiles);
      const fileType = getFileType(acceptedFiles[0]);
      if (!fileType) {
        toast({
          title: "Unsupported File",
          description: "Please upload an image, video, or audio file.",
          variant: "destructive",
        });
        return;
      }
      setSelectedFormat('');
    }
  }, []);

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFiles([]);
    setSelectedFormat('');
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    maxFiles: 1,
    noClick: files.length > 0,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.tiff', '.avif', '.heic'],
      'video/*': ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.flv', '.3gp', '.wmv'],
      'audio/*': ['.mp3', '.wav', '.ogg', '.aac', '.m4a', '.flac', '.wma', '.opus']
    }
  });

  const handleConvert = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!files.length || !selectedFormat || !ffmpeg) return;

    try {
      setConverting(true);
      const file = files[0];
      const outputName = getOutputFileName(file, selectedFormat);

      if (!loaded) {
        await load();
      }

      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      await ffmpeg.writeFile('input', uint8Array);
      await ffmpeg.exec(['-i', 'input', outputName]);

      const data = await ffmpeg.readFile(outputName);
      const blob = new Blob([data as Uint8Array], { type: `${file.type.split('/')[0]}/${selectedFormat}` });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = outputName;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "File converted successfully!",
        duration: 3000,
      });
    } catch (error) {
      console.error('Conversion error:', error);
      toast({
        title: "Error",
        description: "Failed to convert file. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="p-8 w-full max-w-3xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          relative overflow-hidden
          border-2 border-dashed rounded-xl p-8 text-center
          transition-all duration-200 ease-in-out
          ${isDragActive 
            ? 'border-blue-500 bg-blue-500/10' 
            : 'border-gray-600/30 hover:border-gray-600/50 hover:bg-gray-600/5'
          }
          ${files.length > 0 ? 'border-opacity-0' : ''}
        `}
      >
        <input {...getInputProps()} />
        <AnimatePresence mode="wait">
          {files.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="p-4 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <FiFile className="w-8 h-8 text-blue-500" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-gray-200 truncate">
                      {files[0].name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {(files[0].size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={removeFile}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-4 items-center justify-center">
                <div className="w-full max-w-xs space-y-2">
                  <label className="text-sm text-gray-400">Output Format</label>
                  <Select
                    value={selectedFormat}
                    onValueChange={setSelectedFormat}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      {files[0] && getFileType(files[0]) && 
                        formats[getFileType(files[0])!].map((format) => (
                          <SelectItem key={format} value={format}>
                            {format.toUpperCase()}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleConvert}
                  disabled={!selectedFormat || converting || loading}
                  className="w-full max-w-xs relative overflow-hidden"
                >
                  {converting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Converting...
                    </div>
                  ) : loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Loading...
                    </div>
                  ) : (
                    'Convert'
                  )}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="p-3 bg-blue-500/10 rounded-full w-16 h-16 mx-auto">
                <FiUploadCloud className="w-10 h-10 text-blue-500" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-200">
                  {isDragActive ? 'Drop your file here' : 'Drag & drop your file here'}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  or click to browse
                </p>
              </div>
              <p className="text-xs text-gray-500">
                Supports images, videos, and audio files
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
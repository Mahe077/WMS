import { useState, useCallback, useEffect } from "react";
import {
  BrowserMultiFormatReader,
  NotFoundException,
  ChecksumException,
  FormatException,
} from "@zxing/library";

export interface BarcodeScannerState {
  isOpen: boolean;
  isScanning: boolean;
  scanError: string;
  scanSuccess: boolean;
  scannedCode: string;
  videoDevices: MediaDeviceInfo[];
  selectedDeviceId: string;
  scanningActive: boolean;
  cameraAvailable: boolean | null;
}

export interface BarcodeScannerActions {
  openScanner: () => void;
  closeScanner: () => void;
  startScanning: () => Promise<void>;
  switchCamera: (deviceId: string) => Promise<void>;
  setScannedCode: (code: string) => void;
  resetScanner: () => void;
}

export interface BarcodeScannerOptions {
  onSuccess?: (code: string) => void;
  onError?: (error: string) => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export function useBarcodeScanner(options: BarcodeScannerOptions = {}): [BarcodeScannerState, BarcodeScannerActions] {
  const {
    onSuccess,
    onError,
    autoClose = true,
    autoCloseDelay = 2000,
  } = options;

  // State
  const [isOpen, setIsOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState("");
  const [scanSuccess, setScanSuccess] = useState(false);
  const [scannedCode, setScannedCode] = useState("");
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [scanningActive, setScanningActive] = useState(false);
  const [cameraAvailable, setCameraAvailable] = useState<boolean | null>(null);

  // Internal state
  const [codeReader, setCodeReader] = useState<BrowserMultiFormatReader | null>(null);
  const [currentStream, setCurrentStream] = useState<MediaStream | null>(null);

  // Reset scanner state
  const resetScanner = useCallback(() => {
    setScanError("");
    setScanSuccess(false);
    setScannedCode("");
    setScanningActive(false);
  }, []);

  // Clean up camera resources
  const cleanupCamera = useCallback(() => {
    // Stop ZXing scanner
    if (codeReader) {
      try {
        codeReader.reset();
      } catch (error) {
        console.error("Error resetting code reader:", error);
      }
      setCodeReader(null);
    }

    // Stop current stream
    if (currentStream) {
      currentStream.getTracks().forEach((track) => {
        track.stop();
        console.log("Stopped track:", track.kind, track.label);
      });
      setCurrentStream(null);
    }

    // Clean up video element
    const videoElement = document.getElementById("barcode-video-preview") as HTMLVideoElement;
    if (videoElement && videoElement.srcObject) {
      const stream = videoElement.srcObject as MediaStream;
      stream.getTracks().forEach((track) => {
        track.stop();
        console.log("Stopped video element track:", track.kind, track.label);
      });
      videoElement.srcObject = null;
    }
  }, [codeReader, currentStream]);

  // Close scanner
  const closeScanner = useCallback(() => {
    cleanupCamera();
    setIsOpen(false);
    setIsScanning(false);
    setScanningActive(false);
    setVideoDevices([]);
    setSelectedDeviceId("");
    setCameraAvailable(null);
    resetScanner();
  }, [cleanupCamera, resetScanner]);

  // Open scanner
  const openScanner = useCallback(() => {
    setIsOpen(true);
    resetScanner();
  }, [resetScanner]);

  // Start scanning
  const startScanning = useCallback(async () => {
    try {
      setIsScanning(true);
      setScanError("");
      setScanSuccess(false);
      setScanningActive(true);

      // Initialize ZXing code reader
      const reader = new BrowserMultiFormatReader();
      setCodeReader(reader);

      // Get available video devices
      let devices = await reader.listVideoInputDevices();

      // If no devices found, request camera permission to force enumeration
      if (devices.length === 0) {
        try {
          const tempStream = await navigator.mediaDevices.getUserMedia({ video: true });
          tempStream.getTracks().forEach((track) => track.stop());
          devices = await reader.listVideoInputDevices();
        } catch {
          // Permission denied or no camera
        }
      }

      setVideoDevices(devices);
      setCameraAvailable(devices.length > 0);

      if (devices.length === 0) {
        const errorMsg = "No camera devices found. Please check your device and browser permissions, or use a device with a camera.";
        setScanError(errorMsg);
        setIsScanning(false);
        setScanningActive(false);
        setCameraAvailable(false);
        onError?.(errorMsg);
        return;
      }

      // Prefer back-facing camera
      const backCamera = devices.find(
        (d) =>
          d.label.toLowerCase().includes("back") ||
          d.label.toLowerCase().includes("environment")
      );
      const deviceId = backCamera?.deviceId ?? devices[0].deviceId;
      setSelectedDeviceId(deviceId);

      setCameraAvailable(true);

      // Start scanning with selected device
      await reader
        .decodeOnceFromVideoDevice(deviceId, "barcode-video-preview")
        .then((result) => {
          const code = result.getText();
          setScannedCode(code);
          setScanSuccess(true);
          setIsScanning(false);
          setScanningActive(false);

          onSuccess?.(code);

          // Auto-close after success
          if (autoClose) {
            setTimeout(() => {
              closeScanner();
            }, autoCloseDelay);
          }
        })
        .catch((err) => {
          let errorMsg = "Scanning failed. Please try again.";
          
          if (err instanceof NotFoundException) {
            errorMsg = "No barcode found. Please try again.";
          } else if (err instanceof ChecksumException) {
            errorMsg = "Barcode checksum error. Please try again.";
          } else if (err instanceof FormatException) {
            errorMsg = "Unsupported barcode format.";
          } else {
            errorMsg = "Scanning failed. Please check camera permissions.";
          }

          setScanError(errorMsg);
          setIsScanning(false);
          setScanningActive(false);
          onError?.(errorMsg);
        });

      // Store stream reference for cleanup
      setTimeout(() => {
        const videoElement = document.getElementById("barcode-video-preview") as HTMLVideoElement;
        if (videoElement && videoElement.srcObject) {
          setCurrentStream(videoElement.srcObject as MediaStream);
        }
      }, 100);

    } catch (error) {
      console.error("Camera access error:", error);
      const errorMsg = "Camera access denied or not available. Please check your device and browser permissions, or use a device with a camera.";
      setScanError(errorMsg);
      setIsScanning(false);
      setScanningActive(false);
      setCameraAvailable(false);
      onError?.(errorMsg);
    }
  }, [onSuccess, onError, autoClose, autoCloseDelay, closeScanner]);

  // Switch camera
  const switchCamera = useCallback(async (deviceId: string) => {
    if (!codeReader) return;

    try {
      // Stop current stream before switching
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
        setCurrentStream(null);
      }

      setSelectedDeviceId(deviceId);
      setIsScanning(true);
      setScanError("");
      setScanSuccess(false);
      setScanningActive(true);

      await codeReader
        .decodeOnceFromVideoDevice(deviceId, "barcode-video-preview")
        .then((result) => {
          const code = result.getText();
          setScannedCode(code);
          setScanSuccess(true);
          setIsScanning(false);
          setScanningActive(false);

          onSuccess?.(code);

          if (autoClose) {
            setTimeout(() => {
              closeScanner();
            }, autoCloseDelay);
          }
        })
        .catch((err) => {
          let errorMsg = "Scanning failed with selected camera.";
          
          if (err instanceof NotFoundException) {
            errorMsg = "No barcode found. Please try again.";
          }

          setScanError(errorMsg);
          setIsScanning(false);
          setScanningActive(false);
          onError?.(errorMsg);
        });

      // Store new stream reference
      setTimeout(() => {
        const videoElement = document.getElementById("barcode-video-preview") as HTMLVideoElement;
        if (videoElement && videoElement.srcObject) {
          setCurrentStream(videoElement.srcObject as MediaStream);
        }
      }, 100);

    } catch {
      setScanError("Failed to switch camera");
      setIsScanning(false);
      setScanningActive(false);
      onError?.("Failed to switch camera");
    }
  }, [codeReader, currentStream, onSuccess, onError, autoClose, autoCloseDelay, closeScanner]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupCamera();
    };
  }, [cleanupCamera]);

  const state: BarcodeScannerState = {
    isOpen,
    isScanning,
    scanError,
    scanSuccess,
    scannedCode,
    videoDevices,
    selectedDeviceId,
    scanningActive,
    cameraAvailable,
  };

  const actions: BarcodeScannerActions = {
    openScanner,
    closeScanner,
    startScanning,
    switchCamera,
    setScannedCode,
    resetScanner,
  };

  return [state, actions];
}
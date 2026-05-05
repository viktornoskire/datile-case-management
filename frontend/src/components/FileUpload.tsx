import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

type Props = {
    errandId: number;
    onUploaded?: () => void;
};

const MAX_SIZE_MB = 20;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export default function FileUpload({ errandId, onUploaded }: Props) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
        setError("");

        if (rejectedFiles.length > 0) {
            setError("Vissa filer avvisades (fel typ eller för stora).");
            return;
        }

        if (acceptedFiles.length === 0) return;

        setUploading(true);

        const formData = new FormData();
        acceptedFiles.forEach((file) => {
            formData.append("files", file);
        });

        try {
            await fetch(`/api/attachments/${errandId}`, {
                method: "POST",
                body: formData,
            });

            // ✅ notify parent → reload files
            onUploaded?.();

        } catch (err) {
            setError("Upload misslyckades");
            console.error(err);
        } finally {
            setUploading(false);
        }
    }, [errandId, onUploaded]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: true,
        accept: {
            "image/*": [],
            "application/pdf": [],
        },
        maxSize: MAX_SIZE_BYTES,
    });

    return (
        <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700">
                Bilagor
            </label>

            <div className="text-xs text-slate-500">
                Tillåtna filer: jpg, jpeg, png, PDF • Max storlek: {MAX_SIZE_MB} MB
            </div>

            <div
                {...getRootProps()}
                className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition
                ${isDragActive
                    ? "border-blue-400 bg-blue-50"
                    : "border-slate-300 hover:bg-slate-50"
                }`}
            >
                <input {...getInputProps()} />

                {uploading ? (
                    <p className="text-sm text-slate-500">Laddar upp...</p>
                ) : isDragActive ? (
                    <p className="text-sm text-blue-600">Släpp filerna här 👇</p>
                ) : (
                    <p className="text-sm text-slate-500">
                        Dra & släpp filer här eller klicka för att välja
                    </p>
                )}
            </div>

            {error && (
                <div className="text-sm text-red-600">{error}</div>
            )}
        </div>
    );
}
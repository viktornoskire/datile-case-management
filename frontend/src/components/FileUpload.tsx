import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

type Props = {
    errandId: number;
};

const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export default function FileUpload({ errandId }: Props) {
    const [uploading, setUploading] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState("");

    const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
        setError("");

        // ❌ Handle rejected files
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

            setFiles((prev) => [...prev, ...acceptedFiles]);
        } catch (err) {
            setError("Upload misslyckades");
            console.error(err);
        } finally {
            setUploading(false);
        }
    }, [errandId]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: true,

        // ✅ Accept file types
        accept: {
            "image/*": [],
            "application/pdf": [],
        },

        // ✅ Max file size
        maxSize: MAX_SIZE_BYTES,
    });

    return (
        <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700">
                Bilagor
            </label>

            {/* Info text */}
            <div className="text-xs text-slate-500">
                Tillåtna filer: jpg, jpeg, png, PDF • Max storlek: {MAX_SIZE_MB} MB
            </div>

            {/* Dropzone */}
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

            {/* Error */}
            {error && (
                <div className="text-sm text-red-600">{error}</div>
            )}

            {/* Uploaded files preview */}
            {files.length > 0 && (
                <div className="rounded-xl border border-slate-200 p-3">
                    <div className="mb-2 text-xs font-semibold text-slate-500 uppercase">
                        Uppladdade filer
                    </div>

                    <ul className="space-y-1 text-sm text-slate-700">
                        {files.map((file, index) => (
                            <li key={index}>
                                📄 {file.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
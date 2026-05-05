export const FileGrid = ({
                      files,
                      onPreview,
                      onDelete,
                  }: {
    files: any[];
    onPreview?: (file: any) => void;
    onDelete?: (id: number) => void;
}) => {
    return (
        <div className="grid grid-cols-4 gap-3 max-h-64 overflow-y-auto p-1">
            {files.map((file) => (
                <div
                    key={file.id}
                    className="group relative transition hover:scale-[1.02]"
                >
                    {/* IMAGE */}
                    {file.contentType?.startsWith("image/") ? (
                        <img
                            src={`/api/attachments/${file.id}`}
                            className="h-24 w-full object-cover rounded-xl cursor-pointer"
                            onClick={() => onPreview?.(file)}
                        />
                    ) : (
                        <a
                            href={`/api/attachments/${file.id}`}
                            target="_blank"
                            className="flex flex-col items-center justify-center h-24 px-3 text-center rounded-xl bg-slate-100 hover:bg-slate-200 transition"
                        >
                            <span className="text-2xl mb-1">
                                {file.contentType === "application/pdf" ? "📄" : "📎"}
                            </span>

                            <span className="text-xs font-medium text-slate-700 truncate w-full">
                                {file.fileName}
                            </span>
                        </a>
                    )}

                    {/* DELETE BUTTON */}
                    {onDelete && (
                        <button
                            onClick={() => onDelete(file.id)}
                            className="absolute top-1 right-1 hidden group-hover:block bg-red-600 text-white text-xs px-2 py-1 rounded"
                        >
                            ✕
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};
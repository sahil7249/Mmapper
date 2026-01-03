const STEP_TEXT = [
    "Extracting text from PDF",
    "Calling LLM",
    "Converting text to Markdown",
    "Converting Markdown to Mind Map"
]

export const ProgressModal = ({ isModalOpen, currentStep }) => {
    if (!isModalOpen) return null

    const progressPercent = ((currentStep + 1) / STEP_TEXT.length) * 100
    const statusText = STEP_TEXT[currentStep]

    return (
        <>
            {
                isModalOpen && (
                    <div className="border fixed inset-0 z-50 flex items-center justify-center bg-white/50">
                        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600"></div>
                            <h3 className="text-center text-lg font-semibold text-gray-800">
                                {statusText}
                            </h3>
                            <div className="mt-4 h-2 w-full overflow-hidden rounded bg-gray-200">
                                <div
                                    className="h-full bg-indigo-600 transition-all duration-500 ease-out"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                            <p className="mt-2 text-center text-sm text-gray-500">
                                {progressPercent}% completed
                            </p>
                        </div>
                    </div>
                )
            }
        </>
    )
}
import React, { useState } from 'react'
import Loading from './ui/loading'

type Props = {
    pdf_url: string
}

const PDFViewer = ({ pdf_url }: Props) => {
    const [loading, setLoading] = useState(true);

    const handleLoad = () => {
        setLoading(false);
    };

    return (
        <div className="relative w-full h-full">
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white">
                    <Loading />
                </div>
            )}
            <iframe
                src={`https://docs.google.com/gview?url=${pdf_url}&embedded=true`}
                className="w-full h-full"
                onLoad={handleLoad}
            ></iframe>
        </div>
    )
}

export default PDFViewer
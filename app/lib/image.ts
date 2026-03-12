// client image functions

export async function UploadCatImage(file: File, catId: string) {
    if (file.bytes.length > (1 << 22)){ // 8388608 bytes, ~4Mb
        alert("File too large! Maximum 4Mb");
        return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("catId", catId);

    const res = await fetch("/api/cat/image", {
        method: "POST",
        body: formData
    });
    const data = await res.json();

    return data.src;
}
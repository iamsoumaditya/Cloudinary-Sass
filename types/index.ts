export interface Video {
    id: string
    title: string
    description: string
    publicId: string
    originalSize: number
    compressedSize: number
    duration: number
    createdAt: Date
    updatedAt: Date
}

export interface Image {
    id: string
    title: string
    type: string
    publicId: string
    size :number
    createdAt: Date
    updatedAt: Date
}

"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-base-100 text-base-content flex items-center justify-center px-4">
      <div className="text-center max-w-2xl w-full space-y-8">
        <div className="space-y-4">
          <h1 className="text-9xl md:text-8xl font-bold text-primary">
            404
          </h1>

          <h2 className="text-2xl md:text-3xl font-bold">Page Not Found</h2>

          <p className="opacity-70 text-xl">
            The page you're looking for doesn't exist or may have been moved.
          </p>
        </div>

        <div className="card bg-base-content">
          <div className="card-body items-center text-center space-y-4">
            <p className="opacity-70 text-lg">
              Don't worry — you can head back to the homepage and continue
              exploring.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Link href="/home" className="btn btn-primary">
                Go to Home
              </Link>

              <button onClick={()=>router.back()} className="btn btn-ghost">
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

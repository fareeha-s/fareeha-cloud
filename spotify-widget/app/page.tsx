"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // If authenticated and in a popup, send message to parent and close
    if (session?.accessToken && window.opener) {
      console.log("Authentication successful, sending token to parent");
      try {
        window.opener.postMessage(
          { type: 'spotify-auth-success', accessToken: session.accessToken },
          '*'
        );
        setTimeout(() => window.close(), 1000);
      } catch (err) {
        console.error("Error sending message to parent", err);
      }
    }
  }, [session]);

  const handleSignIn = () => {
    signIn("spotify");
  };

  if (!isMounted) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Spotify Authentication</h1>
        
        {status === "loading" ? (
          <p className="text-gray-600">Loading...</p>
        ) : session ? (
          <div className="space-y-4">
            <p className="text-green-600 font-medium">Successfully authenticated with Spotify!</p>
            <p className="text-sm text-gray-600">This window will close automatically.</p>
            <div className="mt-4">
              <button
                onClick={() => signOut()}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600">
              Connect to Spotify to display your recently played tracks.
            </p>
            <button
              onClick={handleSignIn}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              Sign in with Spotify
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

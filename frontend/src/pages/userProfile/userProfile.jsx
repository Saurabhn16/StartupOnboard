import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FaLinkedin, FaTwitter, FaGithub } from "react-icons/fa"; // Import necessary icons
import useUserprofile from "../../hooks/useUserprofile";

const UserProfile = () => {
  const { id } = useParams(); // Get user ID from URL params
  const { userProfile, loading, error, fetchUserProfile } = useUserprofile(); // Custom hook to fetch user profile

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await fetchUserProfile(id);
        // console.log(userProfile); // Fetch user profile based on ID
      } catch (error) {
        console.error("Error fetching user profile:", error.message);
        toast.error("Failed to fetch user profile");
      }
    };

    fetchUser();
  }, [id, fetchUserProfile]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        {/* Profile Card */}
        <div className="flex items-center">
          <img
            className="h-24 w-24 rounded-full mr-4"
            src={
              userProfile?.profile.avatar || "https://via.placeholder.com/150"
            }
            alt="Profile"
          />
          <div>
            <h2 className="text-xl font-semibold">{userProfile?.fullName}</h2>
            <p className="text-gray-500">{userProfile?.role}</p>
            <p className="text-sm text-gray-600 mt-2">
              {userProfile?.profile?.bio || "No bio available"}
            </p>
            <div className="flex mt-4">
              {/* Social Icons */}
              {userProfile?.profile.socialLinks.linkedin && (
                <a
                  href={userProfile?.profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mr-2"
                >
                  <FaLinkedin className="text-gray-700 hover:text-blue-500" />
                </a>
              )}
              {userProfile?.profile.socialLinks.twitter && (
                <a
                  href={userProfile?.profile.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mr-2"
                >
                  <FaTwitter className="text-gray-700 hover:text-blue-500" />
                </a>
              )}
              {userProfile?.profile.socialLinks.github && (
                <a
                  href={userProfile?.profile.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub className="text-gray-700 hover:text-blue-500" />
                </a>
              )}
            </div>
          </div>
        </div>
        {/* Founder Card */}
        {userProfile?.founderDetails && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Founder Details</h3>
            <div className="ml-2">
              <p className="mb-2">
                Startup Name: {userProfile?.founderDetails.startUpName}
              </p>
              <p className="mb-2">
                Startup Vision: {userProfile?.founderDetails.startUpVision}
              </p>
            </div>
          </div>
        )}

        {/* Investor Card */}
        {userProfile?.investorDetails && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Investor Details</h3>
            <p>
              Investment Interests:{" "}
              {userProfile?.investorDetails.investmentInterests.join(", ")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;

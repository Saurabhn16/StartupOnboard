import User from "../models/user.model.js";

export const getUserProfile = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId)
      .populate('founderDetails')
      .populate('investorDetails');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userProfile = {
      _id: user._id,
      fullName: user.fullName,
      role: user.role,
      profile: user.profile,
      founderDetails: user.founderDetails,
      investorDetails: user.investorDetails,
    };

    res.status(200).json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    res.status(500).json({ message: 'Failed to fetch user profile' });
  }
};
// Get user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile, founderDetails, investorDetails, milestones, previousInvestments, role
export const updateProfile = async (req, res) => {
  const {
    fullName,
    gender,
    bio,
    location,
    website,
    linkedin,
    twitter,
    github,
    startUpName,
    startUpVision,
    pitchDeck,
    role,
    investmentInterests,
    previousInvestments,
    networkingInterests,
    milestones,
    previousInvestmentsDetails,
  } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update basic user info
    if (fullName) user.fullName = fullName;
    if (gender) user.profile.gender = gender;
    if (bio) user.profile.bio = bio;
    if (role) user.role = role;
    if (location) user.profile.location = location;
    if (website) user.profile.website = website;
    if (linkedin) user.profile.socialLinks.linkedin = linkedin;
    if (twitter) user.profile.socialLinks.twitter = twitter;
    if (github) user.profile.socialLinks.github = github;

    // Update founder details
    if (startUpName) user.founderDetails.startUpName = startUpName;
    if (startUpVision) user.founderDetails.startUpVision = startUpVision;
    if (pitchDeck) user.founderDetails.pitchDeck = pitchDeck;

    if (milestones && Array.isArray(milestones)) {
      user.founderDetails.milestones = milestones;
    }

    // Update investor details
    if (investmentInterests && Array.isArray(investmentInterests)) {
      user.investorDetails.investmentInterests = investmentInterests;
    }

    if (previousInvestments && Array.isArray(previousInvestments)) {
      user.investorDetails.previousInvestments = previousInvestments;
    }

    if (networkingInterests && Array.isArray(networkingInterests)) {
      user.investorDetails.networkingInterests = networkingInterests;
    }

    if (
      previousInvestmentsDetails &&
      Array.isArray(previousInvestmentsDetails)
    ) {
      user.investorDetails.previousInvestmentsDetails =
        previousInvestmentsDetails;
    }

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

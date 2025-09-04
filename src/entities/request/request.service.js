import User from '../auth/auth.model.js';

export const requestCreatorAccessService = async (userId, message) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found.');
  if (user.creatorAccessStatus === 'pending')
    throw new Error('You already have a pending request.');
  if (user.role === 'creator') throw new Error('You are already a creator.');

  user.creatorAccessRequest = message;
  user.creatorAccessStatus = 'pending';
  await user.save();
  return user;
};

export const getPendingRequestsService = async () => {
  const requests = await User.find({ creatorAccessStatus: 'pending' }).select(
    'name email creatorAccessRequest',
  );
  return requests;
};

export const approveCreatorRequestService = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found.');

  user.role = 'creator';
  user.creatorAccessStatus = 'approved';
  await user.save();
  // We could also send an email notification here in a real app
  return { message: 'User role updated to creator.' };
};

export const rejectCreatorRequestService = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found.');

  user.creatorAccessStatus = 'rejected';
  await user.save();
  // We could also send an email notification here
  return { message: 'Creator request has been rejected.' };
};

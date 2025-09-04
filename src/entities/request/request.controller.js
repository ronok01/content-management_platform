import { generateResponse } from '../../lib/responseFormate.js';
import {
  requestCreatorAccessService,
  getPendingRequestsService,
  approveCreatorRequestService,
  rejectCreatorRequestService,
} from './request.service.js';

export const requestCreatorAccess = async (req, res) => {
  try {
    const userId = req.user.id;
    const { message } = req.body;
    if (!message) {
      return generateResponse(res, 400, false, 'A message is required to request access.');
    }
    await requestCreatorAccessService(userId, message);
    generateResponse(res, 200, true, 'Your request has been submitted for review.');
  } catch (error) {
    console.error(error);
    generateResponse(res, 500, false, error.message);
  }
};

export const getPendingRequests = async (req, res) => {
  try {
    const requests = await getPendingRequestsService();
    generateResponse(res, 200, true, 'Pending creator requests fetched successfully.', requests);
  } catch (error) {
    console.error(error);
    generateResponse(res, 500, false, 'Failed to fetch pending requests.');
  }
};

export const approveRequest = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await approveCreatorRequestService(userId);
    generateResponse(res, 200, true, 'Creator request approved successfully.', result);
  } catch (error) {
    console.error(error);
    generateResponse(res, 500, false, 'Failed to approve request.');
  }
};

export const rejectRequest = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await rejectCreatorRequestService(userId);
    generateResponse(res, 200, true, 'Creator request rejected successfully.', result);
  } catch (error) {
    console.error(error);
    generateResponse(res, 500, false, 'Failed to reject request.');
  }
};

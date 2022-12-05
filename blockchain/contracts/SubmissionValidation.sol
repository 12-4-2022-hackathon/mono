// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

library SubmissionValidation {
    struct Metadata {
        address worker;
        uint x1;
        uint y1;
        uint x2;
        uint y2;
        bool submitted;
        bool verified;
    }

    function performSettlement(Metadata[] memory submissionMetadata) public pure returns (address[] memory) {
        uint x1 = 0;
        uint y1 = 0;
        uint x2 = 0;
        uint y2 = 0;
        for (uint i = 0; i < submissionMetadata.length; i++) {
            x1 += submissionMetadata[i].x1;
            y1 += submissionMetadata[i].y1;
            x2 += submissionMetadata[i].x2;
            y2 += submissionMetadata[i].y2;
        }
        x1 = x1 / submissionMetadata.length;
        y1 = y1 / submissionMetadata.length;
        x2 = x2 / submissionMetadata.length;
        y2 = y2 / submissionMetadata.length;

        uint average_area = (x2 - x1) * (y2 - y1);
        uint count = 0;

        for (uint i = 0; i < submissionMetadata.length; i++) {
            // Calculate the area covered by this submission
            uint submission_x1 = submissionMetadata[i].x1;
            uint submission_y1 = submissionMetadata[i].y1;
            uint submission_x2 = submissionMetadata[i].x2;
            uint submission_y2 = submissionMetadata[i].y2;
            uint submission_area = (submission_x2 - submission_x1) * (submission_y2 - submission_y1);

            // Calculate the area of intersection between the submission and the majority area
            submission_x1 = submission_x1 >= x1 ? submission_x1 : x1;
            submission_y1 = submission_y1 >= y1 ? submission_y1 : y1;
            submission_x2 = submission_x2 < x2 ? submission_x2 : x2;
            submission_y2 = submission_y2 < y2 ? submission_y2 : y2;

            uint intersect_area = (submission_x2 - submission_x1) * (submission_y2 - submission_y1);

            // If more than 50% of the submission's area is outside of the majority area, or 
            // if the submission area is significantly smaller than the average area
            // it is invalid
            if (2 * intersect_area < submission_area || 2 * submission_area < average_area) {
                continue;
            }

            // Otherwise, the submission is valid, so add it to the list of valid submissions
            submissionMetadata[i].verified = true;
            count += 1;
        }

        // do final accounting and return
        address[] memory valid_submissions = new address[](count);
        uint subInd = 0;
        for (uint i = 0; i < submissionMetadata.length; i++) {
            if (submissionMetadata[i].verified == true) {
                valid_submissions[subInd] = submissionMetadata[i].worker;
                subInd += 1;
            }
        }
        return valid_submissions;
    }
}
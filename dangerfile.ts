import { danger, fail, schedule, warn } from 'danger';
import coverage from 'danger-plugin-coverage';

// schedule(coverage());


// const modifiedMD = danger.git.modified_files.join("- ");
// message("Changed Files in this PR: \n - " + modifiedMD);

const bigPRThreshold = 600;
if (danger.github.pr.additions + danger.github.pr.deletions > bigPRThreshold) {
    warn(
        'Pull Request size seems relatively large. If Pull Request contains multiple changes, split each into separate PR will helps faster, easier review.'
    );
}

const packageChanged = danger.git.modified_files.includes('package.json');
const lockfileChanged = danger.git.modified_files.includes('pnpm-lock.yaml');
if (packageChanged && !lockfileChanged) {
    const message = 'Changes were made to package.json, but not to pnpm-lock.yaml';
    const idea = 'Perhaps you need to run `pnpm install`?';
    warn(`${message} - <i>${idea}</i>`);
}

// const pr = danger.github.pr;
// if (pr.assignee === null) {
//     fail(
//         "Please assign someone to merge this PR, and optionally include people who should review."
//     );
// }
// completePr.checkAssignees();
// completePr.checkDescription(10);
// completePr.checkTitle(/^[[A-Za-z]+-\d+]/);

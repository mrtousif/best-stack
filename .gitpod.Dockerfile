FROM gitpod/workspace-full

RUN npm i --location=global pnpm @nestjs/cli dotenv-cli hasura-cli tsx serve fkill-cli

# Install kubectl, k3d, tilt
RUN brew install fzf navi git-secret kubectl k3d starship dbmate go-task/tap/go-task datawire/blackbird/telepresence

# k3d cluster create gitpod

# RUN curl -fsSL https://raw.githubusercontent.com/tilt-dev/tilt/master/scripts/install.sh | bash
import { gql } from 'apollo-boost';

const createUser = gql`
    mutation($data: CreateUserInput!) {
        createUser(data: $data) {
            token
            user {
                id
                name
                email
            }
        }
    }
`;

const getUsers = gql`
    query {
        users {
            id
            name
            email
        }
    }
`;

const login = gql`
    mutation($data: LogInUserInput!) {
        login(data: $data) {
            token
        }
    }
`;

const getProfile = gql`
    query {
        me {
            id
            name
            email
        }
    }
`;

const getPosts = gql`
    query {
        posts {
            id
            title
            body
            published
        }
    }
`;

const getMyPosts = gql`
    query {
        myPosts {
            title
            body
            id
            published
        }
    }
`;
const updatePost = gql`
    mutation($data: updatePostInput!, $id: ID!) {
        updatePost(id: $id, data: $data) {
            id
            title
            body
            published
        }
    }
`;

const createPost = gql`
    mutation($data: CreatePostInput!) {
        createPost(data: $data) {
            title
            body
            published
        }
    }
`;

const deletePost = gql`
    mutation($id: ID!) {
        deletePost(id: $id) {
            id
        }
    }
`;

const deleteComment = gql`
    mutation($id: ID!) {
        deleteComment(id: $id) {
            id
        }
    }
`;

const subscribeToComments = gql`
    subscription($postId: ID!) {
        comment(postId: $postId) {
            mutation
            node {
                id
                text
            }
        }
    }
`;

const subscribeToPost = gql`
    subscription {
        post {
            mutation
            node {
                id
                title
            }
        }
    }
`;

export {
    getProfile,
    login,
    getUsers,
    createUser,
    deletePost,
    createPost,
    updatePost,
    getMyPosts,
    getPosts,
    deleteComment,
    subscribeToComments,
    subscribeToPost
};

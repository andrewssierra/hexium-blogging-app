import 'cross-fetch/polyfill';
import seedDatabase, { userOne, postOne, postTwo } from './utils/seedDatabase';
import getClient from './utils/getClient';
import prisma from '../src/prisma';
import {
    deletePost,
    createPost,
    updatePost,
    getMyPosts,
    getPosts,
    subscribeToPost
} from './utils/operations';

const client = getClient();
beforeEach(seedDatabase);

test('should only return published posts', async () => {
    const response = await client.query({ query: getPosts });
    expect(response.data.posts.length).toBe(1);
    expect(response.data.posts[0].published).toBe(true);
});

test('should fetch my posts', async () => {
    const client = getClient(userOne.jwt);
    const { data } = await client.query({ query: getMyPosts });
    expect(data.myPosts.length).toBe(2);
});

test('should be able to update own post', async () => {
    const client = getClient(userOne.jwt);
    const variables = {
        data: {
            published: false
        },
        id: postOne.post.id
    };
    const { data } = await client.mutate({ mutation: updatePost, variables });
    const exists = await prisma.exists.Post({
        id: postOne.post.id,
        published: false
    });
    expect(data.updatePost.published).toBe(false);
    expect(exists).toBe(true);
});

test('should create a new post', async () => {
    const client = getClient(userOne.jwt);
    const variables = {
        data: {
            title: 'test post',
            body: 'test post',
            published: true
        }
    };
    const { data } = await client.mutate({ mutation: createPost, variables });
    const exists = await prisma.exists.Post({ title: 'test post' });
    expect(data.createPost.title).toBe('test post');
    expect(data.createPost.published).toBe(true);
    expect(data.createPost.body).toBe('test post');
    expect(exists).toBe(true);
});

test('should delete post', async () => {
    const client = getClient(userOne.jwt);
    const variables = {
        id: postTwo.post.id
    };
    await client.mutate({ mutation: deletePost, variables });
    const exists = await prisma.exists.Post({ id: postTwo.post.id });
    expect(exists).toBe(false);
});

test('should subscribe to comments for post', async done => {
    client.subscribe({ query: subscribeToPost }).subscribe({
        next(response) {
            expect(response.data.post.mutation).toBe('DELETED');
            done();
        }
    });
    await prisma.mutation.deletePost({
        where: { id: postOne.post.id }
    });
});

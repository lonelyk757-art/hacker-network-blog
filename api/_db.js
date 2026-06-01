/**
 * Firebase Firestore Database Helper
 * Replaces PostgreSQL with Firebase Firestore
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
let db = null;

function getDb() {
  if (!db) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
      
      if (!serviceAccount.project_id) {
        throw new Error('Missing Firebase credentials');
      }

      const app = initializeApp({
        credential: cert(serviceAccount),
      });

      db = getFirestore(app);
    } catch (error) {
      console.error('Firebase initialization error:', error);
      throw error;
    }
  }
  return db;
}

// Collections
const USERS = 'users';
const POSTS = 'posts';
const COMMENTS = 'comments';

// ============================================
// USERS
// ============================================

export async function createUser(email, passwordHash, username) {
  try {
    const database = getDb();
    const userRef = database.collection(USERS).doc(email);

    const userData = {
      email,
      passwordHash,
      username,
      credits: 300,
      role: 'user',
      verified: false,
      followers: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await userRef.set(userData);
    return { id: email, ...userData };
  } catch (error) {
    console.error('Create user error:', error);
    throw error;
  }
}

export async function getUserByEmail(email) {
  try {
    const database = getDb();
    const doc = await database.collection(USERS).doc(email).get();

    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error('Get user error:', error);
    throw error;
  }
}

export async function getUserById(userId) {
  try {
    const database = getDb();
    const doc = await database.collection(USERS).doc(userId).get();

    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error('Get user by ID error:', error);
    throw error;
  }
}

export async function updateUserCredits(userId, amount) {
  try {
    const database = getDb();
    const userRef = database.collection(USERS).doc(userId);
    const doc = await userRef.get();

    if (!doc.exists) throw new Error('User not found');

    const currentCredits = doc.data().credits || 0;
    const newCredits = Math.max(0, currentCredits + amount);

    await userRef.update({
      credits: newCredits,
      updatedAt: new Date(),
    });

    return { ...doc.data(), credits: newCredits, id: userId };
  } catch (error) {
    console.error('Update credits error:', error);
    throw error;
  }
}

export async function updateUserVerification(userId, verified, followers = 0) {
  try {
    const database = getDb();
    await database.collection(USERS).doc(userId).update({
      verified,
      followers,
      updatedAt: new Date(),
    });
    return true;
  } catch (error) {
    console.error('Update verification error:', error);
    throw error;
  }
}

export async function getAllUsers() {
  try {
    const database = getDb();
    const snapshot = await database.collection(USERS).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Get all users error:', error);
    throw error;
  }
}

export async function deleteUser(userId) {
  try {
    const database = getDb();
    await database.collection(USERS).doc(userId).delete();
    return true;
  } catch (error) {
    console.error('Delete user error:', error);
    throw error;
  }
}

// ============================================
// POSTS
// ============================================

export async function createPost(userId, title, content, type, tags, imageUrl = null) {
  try {
    const database = getDb();
    const postRef = database.collection(POSTS).doc();

    const postData = {
      userId,
      title,
      content,
      type, // 'news', 'blog', 'image'
      tags: Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()),
      imageUrl: imageUrl || null,
      likes: 0,
      likedBy: [],
      commentCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await postRef.set(postData);
    return { id: postRef.id, ...postData };
  } catch (error) {
    console.error('Create post error:', error);
    throw error;
  }
}

export async function getPostById(postId) {
  try {
    const database = getDb();
    const doc = await database.collection(POSTS).doc(postId).get();

    if (!doc.exists) return null;

    const postData = { id: doc.id, ...doc.data() };

    // Get user info
    const userDoc = await database.collection(USERS).doc(postData.userId).get();
    if (userDoc.exists) {
      postData.users = { id: userDoc.id, ...userDoc.data() };
    }

    return postData;
  } catch (error) {
    console.error('Get post error:', error);
    throw error;
  }
}

export async function getPosts(filters = {}) {
  try {
    const database = getDb();
    let query = database.collection(POSTS);

    if (filters.type) {
      query = query.where('type', '==', filters.type);
    }

    if (filters.userId) {
      query = query.where('userId', '==', filters.userId);
    }

    const snapshot = await query
      .orderBy('createdAt', 'desc')
      .limit(filters.limit || 50)
      .get();

    const posts = [];
    for (const doc of snapshot.docs) {
      const postData = { id: doc.id, ...doc.data() };

      // Get user info
      const userDoc = await database.collection(USERS).doc(postData.userId).get();
      if (userDoc.exists) {
        postData.users = { id: userDoc.id, ...userDoc.data() };
      }

      posts.push(postData);
    }

    return posts;
  } catch (error) {
    console.error('Get posts error:', error);
    throw error;
  }
}

export async function updatePost(postId, updates) {
  try {
    const database = getDb();
    const postRef = database.collection(POSTS).doc(postId);

    await postRef.update({
      ...updates,
      updatedAt: new Date(),
    });

    const doc = await postRef.get();
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error('Update post error:', error);
    throw error;
  }
}

export async function deletePost(postId) {
  try {
    const database = getDb();

    // Delete post
    await database.collection(POSTS).doc(postId).delete();

    // Delete associated comments
    const commentsSnapshot = await database
      .collection(COMMENTS)
      .where('postId', '==', postId)
      .get();

    for (const doc of commentsSnapshot.docs) {
      await doc.ref.delete();
    }

    return true;
  } catch (error) {
    console.error('Delete post error:', error);
    throw error;
  }
}

export async function likePost(postId, userId) {
  try {
    const database = getDb();
    const postRef = database.collection(POSTS).doc(postId);
    const doc = await postRef.get();

    if (!doc.exists) throw new Error('Post not found');

    const postData = doc.data();
    const likedBy = postData.likedBy || [];

    // Toggle like
    if (likedBy.includes(userId)) {
      likedBy.splice(likedBy.indexOf(userId), 1);
    } else {
      likedBy.push(userId);
    }

    await postRef.update({
      likes: likedBy.length,
      likedBy,
      updatedAt: new Date(),
    });

    return { ...postData, likes: likedBy.length, id: postId };
  } catch (error) {
    console.error('Like post error:', error);
    throw error;
  }
}

// ============================================
// COMMENTS
// ============================================

export async function addComment(postId, userId, content) {
  try {
    const database = getDb();
    const commentRef = database.collection(COMMENTS).doc();

    const commentData = {
      postId,
      userId,
      content,
      createdAt: new Date(),
    };

    await commentRef.set(commentData);

    // Update post comment count
    const postRef = database.collection(POSTS).doc(postId);
    const postDoc = await postRef.get();
    if (postDoc.exists) {
      await postRef.update({
        commentCount: (postDoc.data().commentCount || 0) + 1,
      });
    }

    return { id: commentRef.id, ...commentData };
  } catch (error) {
    console.error('Add comment error:', error);
    throw error;
  }
}

export async function getComments(postId) {
  try {
    const database = getDb();
    const snapshot = await database
      .collection(COMMENTS)
      .where('postId', '==', postId)
      .orderBy('createdAt', 'asc')
      .get();

    const comments = [];
    for (const doc of snapshot.docs) {
      const commentData = { id: doc.id, ...doc.data() };

      // Get user info
      const userDoc = await database.collection(USERS).doc(commentData.userId).get();
      if (userDoc.exists) {
        commentData.users = { id: userDoc.id, ...userDoc.data() };
      }

      comments.push(commentData);
    }

    return comments;
  } catch (error) {
    console.error('Get comments error:', error);
    throw error;
  }
}

export async function deleteComment(commentId, postId) {
  try {
    const database = getDb();

    await database.collection(COMMENTS).doc(commentId).delete();

    // Update post comment count
    const postRef = database.collection(POSTS).doc(postId);
    const postDoc = await postRef.get();
    if (postDoc.exists) {
      await postRef.update({
        commentCount: Math.max(0, (postDoc.data().commentCount || 1) - 1),
      });
    }

    return true;
  } catch (error) {
    console.error('Delete comment error:', error);
    throw error;
  }
}

// ============================================
// STATS
// ============================================

export async function getStats() {
  try {
    const database = getDb();

    const usersSnapshot = await database.collection(USERS).get();
    const postsSnapshot = await database.collection(POSTS).get();
    const commentsSnapshot = await database.collection(COMMENTS).get();

    let totalLikes = 0;
    postsSnapshot.forEach(doc => {
      totalLikes += doc.data().likes || 0;
    });

    return {
      users: usersSnapshot.size,
      posts: postsSnapshot.size,
      comments: commentsSnapshot.size,
      likes: totalLikes,
    };
  } catch (error) {
    console.error('Get stats error:', error);
    throw error;
  }
}

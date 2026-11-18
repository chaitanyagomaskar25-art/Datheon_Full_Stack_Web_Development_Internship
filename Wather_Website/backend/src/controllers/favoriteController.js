import { Favorite } from '../models/Favorite.js';
import { isDbConnected } from '../config/db.js';

let memoryFavorites = [];

// @desc    Get all saved favorite cities for user
// @route   GET /api/favorites
// @access  Public / Private (returns user's favorites if logged in)
export const getFavorites = async (req, res, next) => {
  try {
    const userId = req.user?._id;

    if (isDbConnected()) {
      const query = userId ? { user: userId } : { user: null };
      const favorites = await Favorite.find(query).sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: favorites.length,
        data: favorites,
      });
    }

    const filtered = userId
      ? memoryFavorites.filter((f) => f.user === userId.toString())
      : memoryFavorites;

    return res.status(200).json({
      success: true,
      count: filtered.length,
      data: filtered,
      notice: 'Served from in-memory fallback.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a city to favorites
// @route   POST /api/favorites
// @access  Public / Private
export const addFavorite = async (req, res, next) => {
  try {
    const { city, country, lat, lon, notes } = req.body;
    const userId = req.user?._id;

    if (!city || !city.trim()) {
      return res.status(400).json({
        success: false,
        errorType: 'VALIDATION_ERROR',
        message: 'City name is required.',
      });
    }

    const trimmedCity = city.trim();
    const trimmedCountry = country ? country.trim() : '';

    if (isDbConnected()) {
      // Check if this city already exists for this user
      const existing = await Favorite.findOne({
        user: userId || null,
        city: new RegExp(`^${trimmedCity}$`, 'i'),
        country: new RegExp(`^${trimmedCountry}$`, 'i'),
      });

      if (existing) {
        return res.status(409).json({
          success: false,
          errorType: 'DUPLICATE',
          message: `${trimmedCity} is already in your favorites.`,
        });
      }

      const favorite = await Favorite.create({
        user: userId || null,
        city: trimmedCity,
        country: trimmedCountry,
        lat: lat ? Number(lat) : undefined,
        lon: lon ? Number(lon) : undefined,
        notes: notes ? notes.trim() : '',
      });

      return res.status(201).json({
        success: true,
        message: `${trimmedCity} added to favorites!`,
        data: favorite,
      });
    }

    // In-memory fallback
    const exists = memoryFavorites.some(
      (f) =>
        f.city.toLowerCase() === trimmedCity.toLowerCase() &&
        (!userId || f.user === userId.toString())
    );

    if (exists) {
      return res.status(409).json({
        success: false,
        message: `${trimmedCity} is already in your favorites.`,
      });
    }

    const newFav = {
      _id: Date.now().toString(),
      user: userId ? userId.toString() : null,
      city: trimmedCity,
      country: trimmedCountry,
      lat,
      lon,
      notes: notes || '',
      createdAt: new Date(),
    };
    memoryFavorites.unshift(newFav);

    return res.status(201).json({
      success: true,
      message: `${trimmedCity} added to favorites.`,
      data: newFav,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'City is already in your favorites.',
      });
    }
    next(error);
  }
};

// @desc    Remove a favorite by ID or city name
// @route   DELETE /api/favorites/:id
// @access  Public / Private
export const removeFavorite = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    if (isDbConnected()) {
      let query;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        query = { _id: id };
      } else {
        query = { city: new RegExp(`^${id}$`, 'i') };
      }

      // If user is logged in, ensure they own the favorite
      if (userId) {
        query.user = userId;
      }

      const deleted = await Favorite.findOneAndDelete(query);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Favorite not found in your saved list.',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Favorite removed successfully.',
      });
    }

    // In-memory fallback
    const initialLen = memoryFavorites.length;
    memoryFavorites = memoryFavorites.filter(
      (f) =>
        f._id !== id &&
        f.city.toLowerCase() !== id.toLowerCase() &&
        (!userId || f.user === userId.toString())
    );

    return res.status(200).json({
      success: true,
      message:
        memoryFavorites.length < initialLen
          ? 'Favorite removed.'
          : 'Favorite not found in memory.',
    });
  } catch (error) {
    next(error);
  }
};

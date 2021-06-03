import axios from 'axios'
import { baseUrl } from '../urls'

import {
    SHOP_LIST_REQUEST,
    SHOP_LIST_SUCCESS,
    SHOP_LIST_FAIL,
    SHOP_BY_VENDOR_REQUEST,
    SHOP_BY_VENDOR_SUCCESS,
    SHOP_BY_VENDOR_FAIL,
    SHOP_DETAILS_REQUEST,
    SHOP_DETAILS_SUCCESS,
    SHOP_DETAILS_FAIL,
    SHOP_DELETE_REQUEST,
    SHOP_DELETE_SUCCESS,
    SHOP_DELETE_FAIL,
    SHOP_CREATE_FAIL,
    SHOP_CREATE_SUCCESS,
    SHOP_CREATE_REQUEST,
    SHOP_UPDATE_REQUEST,
    SHOP_UPDATE_SUCCESS,
    SHOP_UPDATE_FAIL,
} from '../constants/shopConstants'
import { logout } from './userActions'

export const listShops = async (dispatch) => {
    try {
        dispatch({ type: SHOP_LIST_REQUEST })

        const { data } = await axios.get(
            `${baseUrl}/api/shops`
        )

        dispatch({
            type: SHOP_LIST_SUCCESS,
            payload: data,
        })
    } catch (error) {
        dispatch({
            type: SHOP_LIST_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        })
    }
}


export const getShopByVendor = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: SHOP_BY_VENDOR_REQUEST })

        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        }

        const { data } = await axios.get(
            `${baseUrl}/api/shops/vendor/${id}`, config
        )

        dispatch({
            type: SHOP_BY_VENDOR_SUCCESS,
            payload: data,
        })
    } catch (error) {
        dispatch({
            type: SHOP_BY_VENDOR_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        })
    }
}

export const listShopDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: SHOP_DETAILS_REQUEST })

        const { data } = await axios.get(`${baseUrl}/api/shops/${id}`)

        dispatch({
            type: SHOP_DETAILS_SUCCESS,
            payload: data,
        })
    } catch (error) {
        dispatch({
            type: SHOP_DETAILS_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        })
    }
}

export const deleteShop = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: SHOP_DELETE_REQUEST,
        })

        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        }

        await axios.delete(`${baseUrl}/api/shops/${id}`, config)

        dispatch({
            type: SHOP_DELETE_SUCCESS,
        })
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        if (message === 'Not authorized, token failed') {
            dispatch(logout())
        }
        dispatch({
            type: SHOP_DELETE_FAIL,
            payload: message,
        })
    }
}

export const createShop = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: SHOP_CREATE_REQUEST,
        })

        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        }

        const { data } = await axios.post(`${baseUrl}/api/shops`, {}, config)

        dispatch({
            type: SHOP_CREATE_SUCCESS,
            payload: data,
        })
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        if (message === 'Not authorized, token failed') {
            dispatch(logout())
        }
        dispatch({
            type: SHOP_CREATE_FAIL,
            payload: message,
        })
    }
}

export const updateShop = (shop) => async (dispatch, getState) => {
    try {
        dispatch({
            type: SHOP_UPDATE_REQUEST,
        })

        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        }

        const { data } = await axios.put(
            `${baseUrl}/api/shops/${shop._id}`,
            shop,
            config
        )

        dispatch({
            type: SHOP_UPDATE_SUCCESS,
            payload: data,
        })
        dispatch({ type: SHOP_DETAILS_SUCCESS, payload: data })
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        if (message === 'Not authorized, token failed') {
            dispatch(logout())
        }
        dispatch({
            type: SHOP_UPDATE_FAIL,
            payload: message,
        })
    }
}
/*
import { shallowMount, flushPromises } from '@vue/test-utils';
import History from '../expenses/HistoryCard.vue';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { AxiosResponse } from 'axios';
import type { Expenditure } from '../../types';
import api from "../../services/api";
import { AxiosHeaders } from 'axios';


describe('History', () => {
    const twoItemResponse: Expenditure[] = [
        { id: 1, name: 'Hotel', amount: 100, date: new Date(), journeyId: 1 },
        { id: 2, name: 'Food', amount: 50, date: new Date(), journeyId: 1 }
    ];

    const mockAxiosResponse = (data: Expenditure[]): AxiosResponse => ({
        data,
        status: 200,
        statusText: 'OK',
        config: {
            headers: new AxiosHeaders(),
        },
        headers: {},
    });

    vi.mock('../../services/api');
    const mockedApi = vi.mocked(api, true);

    beforeEach(() => {
        // Mocking localStorage to have a selected journeyId
        vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key: string) => {
            if (key === 'selectedJourney') {
                return '1'; // Setting a valid journeyId
            }
            return null;
        });
    });

    it('should render the expenditure list in history', async () => {
        mockedApi.getAllExpenditures.mockResolvedValueOnce(mockAxiosResponse(twoItemResponse));

        const wrapper = shallowMount(History);
        await flushPromises();

        const rows = wrapper.findAll('tbody tr');
        expect(rows.length).toBe(2);
        expect(wrapper.text()).toContain('Hotel');
        expect(wrapper.text()).toContain('Food');
    });
});
*/

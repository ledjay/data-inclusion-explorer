/**
 * Unit Tests for Filter Utilities
 * Tests validation, transformation, and state management functions
 */

import { describe, it, expect } from '@jest/globals';
import {
  validateFilterValue,
  sanitizeUrlParams,
  urlParamsToFilterState,
  filterStateToUrlParams,
  isFilterDefault,
} from '~/lib/filter-utils';
import { Filter } from '~/types/filter';

describe('Filter Utilities', () => {
  // Test fixtures
  const categoricalFilter: Filter = {
    id: 'types',
    label: 'Type',
    type: 'categorical',
    category: 'service-type',
    paramName: 'types',
    required: false,
    defaultValue: null,
    options: [
      { value: 'accompagnement', label: 'Accompagnement', available: true },
      { value: 'aide-financiere', label: 'Aide financière', available: true },
    ],
  };

  const numericFilter: Filter = {
    id: 'score_qualite_minimum',
    label: 'Minimum Quality Score',
    type: 'numeric',
    category: 'quality',
    paramName: 'score_qualite_minimum',
    required: false,
    defaultValue: 0,
    min: 0,
    max: 1,
    step: 0.01,
  };

  const booleanFilter: Filter = {
    id: 'test_boolean',
    label: 'Test Boolean',
    type: 'boolean',
    category: 'other',
    paramName: 'test_boolean',
    required: false,
    defaultValue: false,
  };

  describe('validateFilterValue', () => {
    it('should accept null/undefined values', () => {
      expect(validateFilterValue(categoricalFilter, null).valid).toBe(true);
      expect(validateFilterValue(categoricalFilter, undefined).valid).toBe(true);
    });

    it('should validate categorical filter values', () => {
      expect(validateFilterValue(categoricalFilter, 'accompagnement').valid).toBe(true);
      expect(validateFilterValue(categoricalFilter, 'invalid').valid).toBe(false);
    });

    it('should validate numeric filter values', () => {
      expect(validateFilterValue(numericFilter, 0.5).valid).toBe(true);
      expect(validateFilterValue(numericFilter, 1.5).valid).toBe(false);
      expect(validateFilterValue(numericFilter, 'not-a-number').valid).toBe(false);
    });

    it('should validate boolean filter values', () => {
      expect(validateFilterValue(booleanFilter, true).valid).toBe(true);
      expect(validateFilterValue(booleanFilter, false).valid).toBe(true);
      expect(validateFilterValue(booleanFilter, 'true').valid).toBe(false);
    });
  });

  describe('sanitizeUrlParams', () => {
    it('should keep known filter parameters', () => {
      const params = new URLSearchParams('types=accompagnement');
      const sanitized = sanitizeUrlParams(params, [categoricalFilter]);
      expect(sanitized.get('types')).toBe('accompagnement');
    });

    it('should remove unknown filter parameters', () => {
      const params = new URLSearchParams('unknown_param=value');
      const sanitized = sanitizeUrlParams(params, [categoricalFilter]);
      expect(sanitized.get('unknown_param')).toBeNull();
    });

    it('should remove invalid filter values', () => {
      const params = new URLSearchParams('types=invalid');
      const sanitized = sanitizeUrlParams(params, [categoricalFilter]);
      expect(sanitized.get('types')).toBeNull();
    });
  });

  describe('urlParamsToFilterState', () => {
    it('should convert URL params to filter state', () => {
      const params = new URLSearchParams('types=accompagnement&score_qualite_minimum=0.5');
      const state = urlParamsToFilterState(params, [categoricalFilter, numericFilter]);
      expect(state.types).toBe('accompagnement');
      expect(state.score_qualite_minimum).toBe(0.5);
    });

    it('should convert numeric values to numbers', () => {
      const params = new URLSearchParams('score_qualite_minimum=0.75');
      const state = urlParamsToFilterState(params, [numericFilter]);
      expect(typeof state.score_qualite_minimum).toBe('number');
      expect(state.score_qualite_minimum).toBe(0.75);
    });

    it('should ignore invalid values', () => {
      const params = new URLSearchParams('types=invalid');
      const state = urlParamsToFilterState(params, [categoricalFilter]);
      expect(state.types).toBeUndefined();
    });
  });

  describe('filterStateToUrlParams', () => {
    it('should convert filter state to URL params', () => {
      const state = {
        types: 'accompagnement',
        score_qualite_minimum: 0.5,
      };
      const params = filterStateToUrlParams(state, [categoricalFilter, numericFilter]);
      expect(params.get('types')).toBe('accompagnement');
      expect(params.get('score_qualite_minimum')).toBe('0.5');
    });

    it('should exclude default values', () => {
      const state = {
        types: null,
        score_qualite_minimum: 0, // default value
      };
      const params = filterStateToUrlParams(state, [categoricalFilter, numericFilter]);
      expect(params.get('types')).toBeNull();
      expect(params.get('score_qualite_minimum')).toBeNull();
    });
  });

  describe('isFilterDefault', () => {
    it('should identify default values', () => {
      expect(isFilterDefault(categoricalFilter, null)).toBe(true);
      expect(isFilterDefault(numericFilter, 0)).toBe(true);
      expect(isFilterDefault(booleanFilter, false)).toBe(true);
    });

    it('should identify non-default values', () => {
      expect(isFilterDefault(categoricalFilter, 'accompagnement')).toBe(false);
      expect(isFilterDefault(numericFilter, 0.5)).toBe(false);
      expect(isFilterDefault(booleanFilter, true)).toBe(false);
    });
  });
});

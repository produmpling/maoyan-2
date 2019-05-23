/* ============
 * Actions for the account module
 * ============
 *
 * The actions that are available on the
 * account module.
 */

import Transformer from '@/transformers/AccountTransformer';
import * as types from './mutation-types';

export const find = ({ commit }) => {
  const account = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'jonh@doe.com',
  };

  commit(types.FIND, Transformer.fetch(account));
};

export default {
  find,
};

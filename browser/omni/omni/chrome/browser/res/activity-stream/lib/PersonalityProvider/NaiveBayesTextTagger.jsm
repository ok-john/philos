/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// We load this into a worker using importScripts, and in tests using import.
// We use var to avoid name collision errors.
// eslint-disable-next-line no-var
var EXPORTED_SYMBOLS = ["NaiveBayesTextTagger"];

const NaiveBayesTextTagger = class NaiveBayesTextTagger {
  constructor(model, toksToTfIdfVector) {

  }

  /**
   * Determines if the tokenized text belongs to class according to binary naive Bayes
   * classifier. Returns an object containing the class label ("label"), and
   * the log probability ("logProb") that the text belongs to that class. If
   * the positive class is more likely, then "label" is the positive class
   * label. If the negative class is matched, then "label" is set to null.
   */
  tagTokens(tokens) {
  }
};

// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var category = chrome.experimental.devtools.audits.addCategory( "Images found", 1);

category.onAuditStarted.addListener(function callback(auditResults) {
  chrome.extension.sendRequest({ tabId: webInspector.inspectedWindow.tabId },
    function(results) {
      auditResults.addResult("No broken links", "There are no broken links on the page!", auditResults.Severity.Info);
      auditResults.done();
    });
  });

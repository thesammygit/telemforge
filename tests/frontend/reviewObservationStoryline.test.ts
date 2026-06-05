import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildMissionConsoleView } from "../../frontend/src/features/mission-console/consoleViewModel.ts";
import { stage07ConsoleFixture } from "../../frontend/src/lib/stage07ConsoleFixture.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("buildMissionConsoleView derives Stage 37 storyline segments from the Stage 36 walkthrough", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const walkthrough = view.reviewObservationBoundaryWalkthrough;
  const storyline = view.reviewObservationStoryline;

  assert.ok(walkthrough);
  assert.ok(storyline);
  assert.equal(storyline.schema, "telemforge.review_observation_storyline.v1");
  assert.equal(storyline.version, 1);
  assert.equal(
    storyline.contractLabel,
    "local deterministic observation storyline and static evidence path",
  );
  assert.equal(storyline.localStatus, "fixture");
  assert.strictEqual(storyline.sourceObservationBoundaryWalkthrough, walkthrough);
  assert.equal(
    storyline.summary.defaultOpeningSegmentId,
    storyline.segments[0].segmentId,
  );
  assert.equal(
    storyline.defaultOpening.sourceStepId,
    walkthrough.steps[0].stepId,
  );
  assert.deepEqual(
    storyline.segments.map((segment) => [
      segment.segmentNumber,
      segment.sourceStepId,
      segment.sourceBoundaryRowId,
      segment.sourceSummaryId,
      segment.label,
      segment.sourceSummary,
      segment.sourceAnchorHrefs,
      segment.relatedObservationRowIds,
      segment.relatedSourceStageNumbers,
      segment.staticGuardrailGroupIds,
    ]),
    walkthrough.steps.map((step, index) => [
      index + 1,
      step.stepId,
      step.sourceBoundaryRowId,
      step.sourceSummaryId,
      step.label,
      step.sourceSummary,
      step.sourceAnchorHrefs,
      step.relatedObservationRowIds,
      step.relatedSourceStageNumbers,
      step.staticGuardrailGroupIds,
    ]),
  );
  assert.ok(
    storyline.segments.every(
      (segment) =>
        segment.localOnly &&
        segment.sourceBacked &&
        segment.informationalOnly &&
        segment.nonActionable &&
        segment.nonPersistent &&
        segment.nonExecutable &&
        segment.nonCertifying &&
        segment.nonRanking &&
        segment.inPageOnly &&
        segment.notATask &&
        segment.notATicket &&
        segment.notAChecklist &&
        segment.notOwnerAssigned,
    ),
  );
});

test("buildMissionConsoleView keeps Stage 37 source-stage evidence and guardrails local only", () => {
  const view = buildMissionConsoleView(stage07ConsoleFixture, "thermal");
  const walkthrough = view.reviewObservationBoundaryWalkthrough;
  const storyline = view.reviewObservationStoryline;
  const missionConsoleSource = readFileSync(
    resolve(
      repoRoot,
      "frontend/src/features/mission-console/MissionConsole.tsx",
    ),
    "utf8",
  );

  assert.ok(walkthrough);
  assert.ok(storyline);
  assert.equal(
    storyline.summary.counts.sourceStageEvidenceGroupCount,
    walkthrough.sourcePathGroups.length,
  );
  assert.equal(
    storyline.summary.counts.staticGuardrailReferenceCount,
    walkthrough.staticGuardrailGroups.length,
  );
  assert.deepEqual(
    storyline.sourceStageEvidenceGroups.map((group) => [
      group.sourceStageNumber,
      group.sourcePathGroupId,
      group.sourceAnchorHrefs,
      group.sourceContractLabels,
      group.segmentIds.length,
    ]),
    walkthrough.sourcePathGroups.map((group) => [
      group.sourceStageNumber,
      group.sourcePathGroupId,
      group.anchorHrefs,
      group.sourceContractLabels,
      group.boundaryStepIds.length,
    ]),
  );
  assert.deepEqual(
    storyline.staticGuardrailReferences.map((reference) => [
      reference.sourceGuardrailGroupId,
      reference.kind,
      reference.sourceObservationRowIds,
      reference.sourceAnchorIds,
      reference.segmentIds.length,
    ]),
    walkthrough.staticGuardrailGroups.map((group) => [
      group.guardrailGroupId,
      group.kind,
      group.sourceObservationRowIds,
      group.sourceAnchorIds,
      group.boundaryStepIds.length,
    ]),
  );
  for (const segment of storyline.segments) {
    assert.equal(segment.priorSurfaceReferences.length, 3);
    assert.ok(
      segment.priorSurfaceReferences.every((reference) =>
        reference.anchorHref.startsWith("#"),
      ),
    );
  }
  assert.ok(
    storyline.sourceStageEvidenceGroups.every(
      (group) =>
        group.localOnly &&
        group.sourceBacked &&
        group.informationalOnly &&
        group.nonActionable &&
        group.nonPersistent &&
        group.nonExecutable &&
        group.nonCertifying &&
        group.nonRanking &&
        group.inPageOnly,
    ),
  );
  assert.ok(
    storyline.staticGuardrailReferences.every(
      (reference) =>
        reference.localOnly &&
        reference.staticReviewContext &&
        reference.informationalOnly &&
        reference.nonActionable &&
        reference.nonPersistent &&
        reference.nonExecutable &&
        reference.nonCertifying &&
        reference.nonRanking &&
        reference.notATask &&
        reference.notATicket &&
        reference.notAChecklist &&
        reference.notOwnerAssigned,
    ),
  );
  assert.ok(
    missionConsoleSource.includes('id="review-observation-storyline"'),
    "Mission console should expose a local Stage 37 storyline anchor",
  );
});

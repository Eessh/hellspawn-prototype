# Same field, same moment, two writers: declared merge rule or loud failure

When two systems write the same component field in the same commit, the engine requires a registered reducer — an explicit merge rule such as "sum" or "higher priority wins". No reducer means the run fails loudly at commit with both writers named in the trace. Silent last-writer-wins is banned: it always "works", picks an arbitrary winner, and hides the bug forever. Conflicts are detected from staged change sets, since the event queue alone cannot reveal what a system will touch.

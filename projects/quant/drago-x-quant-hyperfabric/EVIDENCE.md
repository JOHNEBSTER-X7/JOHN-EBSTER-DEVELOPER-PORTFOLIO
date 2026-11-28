# Benchmark and test evidence capture guide

This guide is for producing genuine, reproducible evidence for the DRAGO X QUANT HYPERFABRIC portfolio case study.

## Evidence rules

- Do not invent benchmark numbers, test counts, CI pass rates or screenshots.
- Record the exact commit SHA tested.
- Record host OS, CPU, RAM, Python/compiler/Rust versions and relevant configuration.
- Separate warm-up from measured iterations.
- Keep raw output alongside any chart or screenshot.
- Label all results as local/reference measurements unless an independently controlled venue or hardware test establishes otherwise.
- Remove secrets, tokens, private endpoints, licensed market data and proprietary configuration before publication.

## Suggested evidence set

1. **Test run:** terminal output showing the exact command, commit SHA and final test summary.
2. **Benchmark report:** generated JSON plus a screenshot of the report summary.
3. **Latency distribution:** chart derived directly from the benchmark output, showing P50, P95, P99 and P99.9 where the report contains those fields.
4. **Market-state replay:** output from a deterministic fixture showing sequence handling and reconstructed book state.
5. **Native component tests:** C++ and Rust test output, each labelled with compiler/toolchain versions.

## Commands documented by the implementation

Run from the private implementation repository after checking out the commit being evaluated:

```bash
pytest
cargo test --manifest-path native/rust/Cargo.toml
python scripts/run_benchmarks.py --iterations 2000 --output qh-benchmark-report.json
```

C++ SPSC test:

```bash
g++ -std=c++17 -O2 -pthread \
  -I native/cpp/include \
  native/cpp/tests/spsc_ring_buffer_test.cpp \
  -o qh-spsc-test
./qh-spsc-test
```

## Capture metadata

For every run, save:

- UTC timestamp
- repository commit SHA
- command and arguments
- operating system and kernel
- CPU model and core count
- RAM
- language/runtime/compiler versions
- input fixture and workload size
- warm-up count and measured iteration count
- output file checksum
- test/benchmark exit status

## Publication status

No numerical benchmark result or screenshot is included by this guide. Add those only after running the commands on a documented environment and checking the output. Local results are not production exchange latency, colocation certification, or proof of trading performance.

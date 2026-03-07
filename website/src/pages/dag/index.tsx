/**
 * DAG Landing Page
 *
 * Overview of the DAG execution framework with links to builder and monitor.
 */

import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './dag.module.css';

const FEATURES = [
  {
    icon: '📊',
    title: 'Visual DAG Builder',
    description: 'Create execution graphs visually with drag-and-drop node creation and dependency management.',
    link: '/dag/builder',
    cta: 'Open Builder',
  },
  {
    icon: '📈',
    title: 'Execution Monitor',
    description: 'Watch your workflows execute in real-time with detailed progress, logs, and statistics.',
    link: '/dag/monitor',
    cta: 'Open Monitor',
  },
  {
    icon: '⚙️',
    title: 'Skill Orchestration',
    description: 'Combine multiple skills into powerful pipelines with parallel execution and smart scheduling.',
    link: '#',
    cta: 'Coming Soon',
  },
  {
    icon: '🔍',
    title: 'Semantic Matching',
    description: 'Automatically find the best skills for your tasks using intelligent semantic matching.',
    link: '#',
    cta: 'Coming Soon',
  },
  {
    icon: '✅',
    title: 'Quality Assurance',
    description: 'Built-in output validation, confidence scoring, and hallucination detection.',
    link: '#',
    cta: 'Coming Soon',
  },
  {
    icon: '📡',
    title: 'Observability',
    description: 'Full execution tracing, performance profiling, and pattern learning for optimization.',
    link: '#',
    cta: 'Coming Soon',
  },
];

const EXAMPLE_WORKFLOWS = [
  {
    name: 'Code Review Pipeline',
    nodes: 4,
    description: 'Lint → Test → Security Scan → Review Report',
  },
  {
    name: 'Documentation Generator',
    nodes: 5,
    description: 'Parse Code → Extract APIs → Generate Docs → Format → Publish',
  },
  {
    name: 'Data Processing',
    nodes: 6,
    description: 'Fetch → Validate → Transform → Analyze → Visualize → Export',
  },
];

export default function DAGPage(): React.ReactElement {
  return (
    <Layout
      title="DAG Execution Framework"
      description="Build and execute intelligent skill workflows with the DAG framework"
    >
      <div className={styles.container}>
        {/* Hero Section */}
        <div className={styles.hero}>
          <div className={styles.heroWindow}>
            <div className={styles.windowHeader}>
              <span>📊 DAG Execution Framework</span>
              <div className={styles.windowControls}>
                <span className={styles.windowButton}>_</span>
                <span className={styles.windowButton}>□</span>
              </div>
            </div>
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>
                Dynamic Skill Agent Graphs
              </h1>
              <p className={styles.heroSubtitle}>
                Build intelligent workflows that orchestrate skills, spawn agents,
                and solve complex problems through parallel execution.
              </p>
              <div className={styles.heroCtas}>
                <Link to="/dag/builder" className={styles.primaryCta}>
                  ➕ Create Workflow
                </Link>
                <Link to="/dag/monitor" className={styles.secondaryCta}>
                  📈 Monitor Execution
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Framework Capabilities</h2>
          <div className={styles.featuresGrid}>
            {FEATURES.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <div className={styles.featureHeader}>
                  <span className={styles.featureIcon}>{feature.icon}</span>
                  <span className={styles.featureTitle}>{feature.title}</span>
                </div>
                <p className={styles.featureDescription}>{feature.description}</p>
                <Link to={feature.link} className={styles.featureLink}>
                  {feature.cta} →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Architecture Overview */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Architecture Layers</h2>
          <div className={styles.architectureWindow}>
            <div className={styles.windowHeader}>
              <span>📦 System Architecture</span>
            </div>
            <div className={styles.architectureContent}>
              <div className={styles.layerStack}>
                <div className={styles.layer}>
                  <div className={styles.layerLabel}>Layer 6</div>
                  <div className={styles.layerBox}>
                    <span className={styles.layerTitle}>Observability</span>
                    <span className={styles.layerItems}>
                      execution-tracer • performance-profiler • failure-analyzer • pattern-learner
                    </span>
                  </div>
                </div>
                <div className={styles.layer}>
                  <div className={styles.layerLabel}>Layer 5</div>
                  <div className={styles.layerBox}>
                    <span className={styles.layerTitle}>Feedback & Learning</span>
                    <span className={styles.layerItems}>
                      iteration-detector • feedback-synthesizer • convergence-monitor
                    </span>
                  </div>
                </div>
                <div className={styles.layer}>
                  <div className={styles.layerLabel}>Layer 4</div>
                  <div className={styles.layerBox}>
                    <span className={styles.layerTitle}>Quality Assurance</span>
                    <span className={styles.layerItems}>
                      output-validator • confidence-scorer • hallucination-detector
                    </span>
                  </div>
                </div>
                <div className={styles.layer}>
                  <div className={styles.layerLabel}>Layer 3</div>
                  <div className={styles.layerBox}>
                    <span className={styles.layerTitle}>Permission & Scoping</span>
                    <span className={styles.layerItems}>
                      permission-validator • scope-enforcer • isolation-manager
                    </span>
                  </div>
                </div>
                <div className={styles.layer}>
                  <div className={styles.layerLabel}>Layer 2</div>
                  <div className={styles.layerBox}>
                    <span className={styles.layerTitle}>Registry & Discovery</span>
                    <span className={styles.layerItems}>
                      skill-registry • semantic-matcher • capability-ranker
                    </span>
                  </div>
                </div>
                <div className={styles.layer}>
                  <div className={styles.layerLabel}>Layer 1</div>
                  <div className={styles.layerBox}>
                    <span className={styles.layerTitle}>Orchestration</span>
                    <span className={styles.layerItems}>
                      graph-builder • dependency-resolver • task-scheduler • parallel-executor
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Example Workflows */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Example Workflows</h2>
          <div className={styles.examplesGrid}>
            {EXAMPLE_WORKFLOWS.map((workflow, index) => (
              <div key={index} className={styles.exampleCard}>
                <div className={styles.windowHeader}>
                  <span>📋 {workflow.name}</span>
                </div>
                <div className={styles.exampleContent}>
                  <div className={styles.exampleStats}>
                    <span>{workflow.nodes} nodes</span>
                  </div>
                  <div className={styles.exampleFlow}>
                    {workflow.description}
                  </div>
                  <Link to="/dag/builder" className={styles.exampleCta}>
                    Use Template →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Getting Started */}
        <section className={styles.section}>
          <div className={styles.gettingStartedWindow}>
            <div className={styles.windowHeader}>
              <span>🚀 Getting Started</span>
            </div>
            <div className={styles.gettingStartedContent}>
              <div className={styles.stepsList}>
                <div className={styles.step}>
                  <span className={styles.stepNumber}>1</span>
                  <div className={styles.stepContent}>
                    <strong>Create a Workflow</strong>
                    <p>Use the visual builder to create your execution graph by adding nodes and dependencies.</p>
                  </div>
                </div>
                <div className={styles.step}>
                  <span className={styles.stepNumber}>2</span>
                  <div className={styles.stepContent}>
                    <strong>Configure Skills</strong>
                    <p>Select skills for each node and configure input/output mappings between them.</p>
                  </div>
                </div>
                <div className={styles.step}>
                  <span className={styles.stepNumber}>3</span>
                  <div className={styles.stepContent}>
                    <strong>Execute & Monitor</strong>
                    <p>Run your workflow and monitor execution in real-time with detailed logs and stats.</p>
                  </div>
                </div>
                <div className={styles.step}>
                  <span className={styles.stepNumber}>4</span>
                  <div className={styles.stepContent}>
                    <strong>Iterate & Improve</strong>
                    <p>Use observability insights to optimize your workflows based on performance patterns.</p>
                  </div>
                </div>
              </div>
              <div className={styles.gettingStartedCta}>
                <Link to="/dag/builder" className={styles.primaryCta}>
                  Start Building →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

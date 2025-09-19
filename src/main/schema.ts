export const MINDMAP_SCHEMA = {
  name: 'mindmap',
  schema: {
    type: 'object',
    additionalProperties: false,
    required: ['root_question', 'nodes', 'edges', 'can_expand'],
    properties: {
      root_question: { type: 'string' },
      nodes: {
        type: 'array',
        minItems: 3,
        items: {
          type: 'object',
          required: ['id', 'title', 'level'],
          additionalProperties: false,
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            summary: { type: 'string' },
            level: { type: 'integer', minimum: 0 },
            tokens_estimate: { type: 'integer' },
            metadata: {
              type: 'object',
              additionalProperties: { type: 'string' }
            }
          }
        }
      },
      edges: {
        type: 'array',
        items: {
          type: 'object',
          required: ['from', 'to'],
          additionalProperties: false,
          properties: {
            from: { type: 'string' },
            to: { type: 'string' },
            label: { type: 'string' }
          }
        }
      },
      can_expand: { type: 'boolean' }
    }
  },
  strict: true
}

export const NODE_DETAIL_SCHEMA = {
  name: 'node_detail',
  schema: {
    type: 'object',
    additionalProperties: false,
    required: ['overview_md', 'facts'],
    properties: {
      overview_md: { type: 'string' },
      facts: {
        type: 'array',
        maxItems: 7,
        items: { type: 'string' }
      }
    }
  },
  strict: true
}

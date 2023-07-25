// main.js
const app = new Vue({
    el: '#app',
    data() {
      return {
        comments: [],
        loading: false,
      };
    },
    computed: {
      goodCount() {
        return this.comments.filter((comment) => comment.category === 'Good').length;
      },
      badCount() {
        return this.comments.filter((comment) => comment.category === 'Bad').length;
      },
      neutralCount() {
        return this.comments.filter((comment) => comment.category === 'Neutral').length;
      },
    },
    methods: {
      async fetchComments() {
        this.loading = true;
        const query = `
          query {
            repository(owner: "vuejs", name: "create-vue") {
              issues(first: 100) {
                nodes {
                  comments(first: 100) {
                    nodes {
                      bodyText
                    }
                  }
                }
              }
            }
          }
        `;
  
        try {
          const response = await axios.post(
            'https://api.github.com/graphql',
            {
              query,
            },
            {
              headers: {
                Authorization: `Bearer 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`,
              },
            }
          );
  
          this.comments = this.classifyComments(response.data.data.repository.issues.nodes);
        } catch (error) {
          console.error('Error fetching comments:', error.message);
        } finally {
          this.loading = false;
        }
      },
      classifyComments(nodes) {
        const classifiedComments = [];
        nodes.forEach((issue) => {
          issue.comments.nodes.forEach((comment) => {
            const text = comment.bodyText.toLowerCase();
            let category = 'Neutral';
  
            // Add your own classification logic here.
            // For example:
            if (text.includes('good')) {
              category = 'Good';
            } else if (text.includes('bad')) {
              category = 'Bad';
            }
  
            classifiedComments.push({
              text,
              category,
            });
          });
        });
        return classifiedComments;
      },
    },
    mounted() {
      this.fetchComments();
    },
  });
  
<?php

namespace Groundhogg\Reporting\New_Reports;

use Groundhogg\Classes\Activity;
use Groundhogg\Email;
use Groundhogg\Plugin;
use function Groundhogg\_nf;
use function Groundhogg\get_db;
use function Groundhogg\html;

class Table_Email_Links_Clicked extends Base_Table_Report {

	/**
	 * @return array|mixed
	 */
	public function get_label() {
		return [
			__( 'Link', 'groundhogg' ),
			__( 'Uniques', 'groundhogg' ),
			__( 'Clicks', 'groundhogg' ),
		];
	}

	protected function get_table_data() {

		$email = new Email( $this->get_email_id() );

		$activity = get_db( 'activity' )->query( [
			'email_id'      => $email->get_id(),
			'activity_type' => Activity::EMAIL_CLICKED,
			'before'        => $this->end,
			'after'         => $this->start,
		] );

		$links = [];

		foreach ( $activity as $event ) {

			if ( ! isset( $links[ $event->referer_hash ] ) ) {
				$links[ $event->referer_hash ] = [
					'referer'  => $event->referer,
					'hash'     => $event->referer_hash,
					'contacts' => [],
					'uniques'  => 0,
					'clicks'   => 0,
				];
			}

			$links[ $event->referer_hash ]['clicks'] ++;
			$links[ $event->referer_hash ]['contacts'][] = $event->contact_id;
			$links[ $event->referer_hash ]['uniques']    = count( array_unique( $links[ $event->referer_hash ]['contacts'] ) );
		}

		if ( empty( $links ) ) {
			return [];
		}


		$data = [];
		foreach ( $links as $hash => $link ) {
			$data[] = [
				'label'   => html()->wrap( $link['referer'], 'a', [
					'href'   => $link['referer'],
					'class'  => 'number-total',
					'title'  => $link['referer'],
					'target' => '_blank',
				] ),
				'uniques' => html()->wrap( _nf( $link['uniques'] ), 'a', [
					'href'  => add_query_arg(
						[
							'activity' => [
								'activity_type' => Activity::EMAIL_CLICKED,
								'email_id'      => $email->get_id(),
								'referer_hash'  => $hash,
								'before'        => $this->end,
								'after'         => $this->start
							]
						],
						admin_url( sprintf( 'admin.php?page=gh_contacts' ) )
					),
					'class' => 'number-total'
				] ),
				'clicks'  => html()->wrap( _nf( $link['clicks'] ), 'span', [ 'class' => 'number-total' ] ),
			];
		}

		return $data;


	}

	/**
	 * Normalize a datum
	 *
	 * @param $item_key
	 * @param $item_data
	 *
	 * @return array
	 */
	protected function normalize_datum( $item_key, $item_data ) {
		return $item_data;
	}


}